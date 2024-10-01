'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Bell, Search, User, Book, ChevronLeft, ChevronRight } from 'lucide-react'
import NavbarBooks from "@/components/NavBarBooks";

// Función para obtener libros reales desde Google Books API
import axios from 'axios'

const fetchBooks = async (category: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=10`
  )
  const data = await response.json()

  const books = data.items ? data.items.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || ['Unknown Author'],
    description: item.volumeInfo.description,
    imageLinks: {
      thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ||
                 item.volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
                 '/placeholder.svg',
    }
  })) : []

  return books
}

interface ButtonProps {
  children: React.ReactNode
  variant?: "default" | "ghost"
}

const categories = ['Fantasy', 'Science Fiction', 'Romance', 'Police', 'Mystery', 'Classics']

// Componente UI para botón
const Button: React.FC<ButtonProps> = ({ children, variant = "default" }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
  const variantClasses = variant === "ghost"
    ? "text-gray-300 hover:bg-gray-700 hover:text-white"
    : "bg-blue-500 text-white hover:bg-blue-600"
  return (
    <button className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  )
}

// Componente UI para input
const Input = ({ ...props }) => (
  <input
    {...props}
    className="px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
)

interface ScrollAreaProps {
  children: React.ReactNode
  scrollContainerRef: React.RefObject<HTMLDivElement>
  onScrollLeft: () => void
  onScrollRight: () => void
}

// Componente ScrollArea para hacer scroll horizontal con botones
const ScrollArea: React.FC<ScrollAreaProps> = ({ children, scrollContainerRef, onScrollLeft, onScrollRight }) => (
  <div className="relative group">
    <div ref={scrollContainerRef} className="relative overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 pb-4">
        {children}
      </div>
    </div>
    {/* Botón de scroll izquierdo */}
    <button
      className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-900 to-transparent text-white p-2 hidden group-hover:block"
      onClick={onScrollLeft}
    >
      <ChevronLeft className="h-8 w-8" />
    </button>
    {/* Botón de scroll derecho */}
    <button
      className="absolute right-0 top-0 h-full bg-gradient-to-l from-gray-900 to-transparent text-white p-2 hidden group-hover:block"
      onClick={onScrollRight}
    >
      <ChevronRight className="h-8 w-8" />
    </button>
  </div>
)

interface Book {
  id: string
  title: string
  authors: string[]
  description: string
  imageLinks: {
    thumbnail: string
    smallThumbnail: string
    extraLarge: string
    large: string
    medium: string

  }
}

interface BookCarouselProps {
  books: Book[]
  onSelectBook: (book: Book) => void // Añadimos la función para seleccionar un libro
}

// Componente BookCarousel
const BookCarousel: React.FC<BookCarouselProps> = ({ books, onSelectBook }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' })
    }
  }

  return (
    <ScrollArea scrollContainerRef={scrollContainerRef} onScrollLeft={scrollLeft} onScrollRight={scrollRight}>
      {books.map((book) => (
        <div key={book.id} className="pt-4 hover:scale-105 lg:w-[180px] md:w-[120px] w-[90px] shrink-0" onClick={() => onSelectBook(book)}> {/* onClick para seleccionar libro */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-md">
            <img
              src={book.imageLinks.thumbnail}
              alt={book.title}
              width={1000}
              height={1000}
              className="object-cover w-full h-full transition-transform duration-700"
            />
            {book.authors.length > 1 && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Book className="h-4 w-4" />
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {book.authors.length}
                </span>
              </div>
            )}
          </div>
          <h3 className="pt-2 mt-2 text-sm font-medium leading-tight text-white">{book.title}</h3>
          <p className="pt-2 text-xs text-gray-400">{book.authors[0]}</p>
        </div>
      ))}
    </ScrollArea>
  )
}

const SelectedBook: React.FC<{ book: Book }> = ({ book }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionLength = 300;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = book.description && book.description.length > maxDescriptionLength
    ? `${book.description.slice(0, maxDescriptionLength)}...`
    : book.description;

  return (
    <div className="sticky top-0 h-screen p-4 bg-gray-800 rounded-lg overflow-y-auto"> {/* sticky y h-screen */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-center">{book.title}</h2>
        <p className="lg:text-xl text-gray-300 mb-2">Autor(es): {book.authors.join(', ')}</p>
        <img
            src={book.imageLinks.thumbnail}
            alt={book.title}
            className="rounded-md mb-4 max-w-xs"
        />
        <p className="text-gray-300">
          {showFullDescription ? book.description : truncatedDescription}
        </p>
        {book.description && book.description.length > maxDescriptionLength && (
            <button
                className="text-blue-500 mt-2 hover:underline"
                onClick={toggleDescription}
            >
              {showFullDescription ? 'Ver menos' : 'Ver más'}
            </button>
        )}
      </div>
    </div>
  );
};


// Página principal
export default function HomePage() {
  const [booksByCategory, setBooksByCategory] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const loadBooks = async () => {
      const booksData = await Promise.all(
        categories.map(async (category) => {
          const books = await fetchBooks(category);
          return { category, books };
        })
      );
      setBooksByCategory(booksData);
      if (booksData.length > 0 && booksData[0].books.length > 0) {
        setSelectedBook(booksData[0].books[0]); // Seleccionar el primer libro de la primera categoría
      }
    };

    loadBooks();
  }, []);

  return (
      <div>
        <NavbarBooks/>
        <div className="bg-gray-900 min-h-screen text-white flex "> {/* Añadimos flex al main contenedor */}

          {/* Columna fija para el libro seleccionado */}
          <div className="hidden md:block md:w-2/4 lg:w-2/5 p-4 pt-20 ">
            {selectedBook && <SelectedBook book={selectedBook}/>}
          </div>

          {/* Columna desplazable para el contenido (carrusel y categorías) */}
          <div
              className="pt-20 w-full md:w-2/4 lg:w-4/5 p-4 overflow-y-auto h-screen"> {/* Añadimos overflow-y-auto y h-screen */}
            <h2 className="text-3xl font-bold mb-6">Explora por Categoría</h2>
            <div className="space-y-8">
              {booksByCategory.map(({category, books}) => (
                  <section key={category} className="space-y-4">
                    <h3 className="text-2xl font-semibold">{category}</h3>
                    <BookCarousel books={books} onSelectBook={setSelectedBook}/> {/* Pasar la función de selección */}
                  </section>
              ))}
            </div>
          </div>
        </div>

      </div>

  );
}
