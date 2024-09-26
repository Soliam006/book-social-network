'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Bell, Search, User, Book, ChevronLeft, ChevronRight } from 'lucide-react'
import NavbarBooks from "@/components/NavBarBooks";

// Función para obtener libros reales desde Google Books API
const fetchBooks = async (category: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=10`
  )
  const data = await response.json()
  return data.items ? data.items.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors || ['Unknown Author'],
    imageLinks: {
      thumbnail: item.volumeInfo.imageLinks
        ? item.volumeInfo.imageLinks.thumbnail.replace('http://', 'https://') // Asegurar HTTPS
        : '/placeholder.svg'
    }
  })) : []
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
  imageLinks: {
    thumbnail: string
  }
}

interface BookCarouselProps {
  books: Book[]
}

// Componente BookCarousel
const BookCarousel: React.FC<BookCarouselProps> = ({ books }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <ScrollArea scrollContainerRef={scrollContainerRef} onScrollLeft={scrollLeft} onScrollRight={scrollRight}>
      {books.map((book) => (
        <div key={book.id} className="w-[150px] shrink-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-md">
            <img
              src={book.imageLinks.thumbnail}
              alt={book.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
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
          <h3 className="mt-2 text-sm font-medium leading-tight text-white">{book.title}</h3>
          <p className="text-xs text-gray-400">{book.authors[0]}</p>
        </div>
      ))}
    </ScrollArea>
  )
}

// Componente HomePage con integración de Google Books API
export default function HomePage() {
  const [booksByCategory, setBooksByCategory] = useState<any[]>([])

  useEffect(() => {
    // Cargar libros de todas las categorías
    const loadBooks = async () => {
      const booksData = await Promise.all(
        categories.map(async (category) => {
          const books = await fetchBooks(category)
          return { category, books }
        })
      )
      setBooksByCategory(booksData)
    }

    loadBooks()
  }, [])

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <NavbarBooks />

      <main className="p-8 mt-12 md:mt-0">
        <h2 className="text-3xl font-bold mb-6">Explora por Categoría</h2>
        <div className="space-y-8 ">
          {booksByCategory.map(({ category, books }) => (
            <section key={category} className="space-y-4">
              <h3 className="text-2xl font-semibold">{category}</h3>
              <BookCarousel books={books} />
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
