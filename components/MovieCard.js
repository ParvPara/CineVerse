'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.some(fav => fav.id === movie.id))
  }, [movie.id])

  const toggleFavorite = (e) => {
    e.stopPropagation() // Prevent card click when clicking favorite button
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.id !== movie.id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(movie)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
    
    setIsFavorite(!isFavorite)
  }

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`)
  }

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-[400px]">
        <Image
          src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <button
            onClick={toggleFavorite}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span>•</span>
          <span>{new Date(movie.release_date).getFullYear()}</span>
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3">
          {movie.overview}
        </p>
      </div>
    </div>
  )
} 