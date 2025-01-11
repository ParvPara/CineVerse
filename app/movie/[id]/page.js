'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MovieDetail({ params }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cast, setCast] = useState([])

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details
        const movieRes = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )
        const movieData = await movieRes.json()
        setMovie(movieData)

        // Fetch cast information
        const creditsRes = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${params.id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )
        const creditsData = await creditsRes.json()
        setCast(creditsData.cast.slice(0, 6)) // Get top 6 cast members
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [params.id])

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>
  }

  if (!movie) {
    return <div className="text-center mt-10">Movie not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center mb-6 text-blue-500 hover:text-blue-600"
      >
        ← Back to Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Movie Poster */}
        <div className="relative h-[600px] md:h-[450px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Movie Details */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
          </div>

          {/* Genres */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Top Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="flex items-center space-x-2">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src={
                        person.profile_path
                          ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/w185${person.profile_path}`
                          : '/placeholder.png'
                      }
                      alt={person.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-gray-400">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Original Language</h3>
              <p className="text-gray-400">{movie.original_language.toUpperCase()}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Budget</h3>
              <p className="text-gray-400">
                ${movie.budget.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Revenue</h3>
              <p className="text-gray-400">
                ${movie.revenue.toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Status</h3>
              <p className="text-gray-400">{movie.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 