'use client'

import { useState, useEffect } from 'react'
import MovieCard from '@/components/MovieCard'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(storedFavorites)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Your Favorite Movies</h1>
      
      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">
          You haven't added any movies to your favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
} 