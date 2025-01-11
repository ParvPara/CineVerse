'use client'

import { useState, useEffect, useRef } from 'react'
import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'

function ScrollButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${
        direction === 'left' ? 'left-2' : 'right-2'
      } z-10 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 backdrop-blur-sm transition-all`}
    >
      {direction === 'left' ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      )}
    </button>
  )
}

function SurpriseButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all disabled:opacity-50"
    >
      {loading ? (
        "Loading..."
      ) : (
        <>
          <span>Surprise Me</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </>
      )}
    </button>
  )
}

export default function Home() {
  const [movies, setMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [popularLoading, setPopularLoading] = useState(true)
  const scrollContainerRef = useRef(null)
  const popularContainerRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [popularIndex, setPopularIndex] = useState(0)
  const autoScrollIntervalRef = useRef(null)
  const popularAutoScrollIntervalRef = useRef(null)
  const [surpriseLoading, setSurpriseLoading] = useState(false)

  // Fetch trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )
        const data = await res.json()
        setTrendingMovies([...data.results, ...data.results])
      } catch (error) {
        console.error('Error fetching trending movies:', error)
      } finally {
        setTrendingLoading(false)
      }
    }

    fetchTrendingMovies()
  }, [])

  // Fetch popular movies
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )
        const data = await res.json()
        setPopularMovies([...data.results, ...data.results])
      } catch (error) {
        console.error('Error fetching popular movies:', error)
      } finally {
        setPopularLoading(false)
      }
    }

    fetchPopularMovies()
  }, [])

  // Auto-scroll functionality for trending movies
  useEffect(() => {
    if (!scrollContainerRef.current || trendingLoading || trendingMovies.length === 0) return

    const scrollContainer = scrollContainerRef.current
    const cardWidth = 350
    const totalCards = trendingMovies.length
    let isScrolling = true

    const scroll = () => {
      if (!isScrolling) return

      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalCards
        const scrollPosition = nextIndex * cardWidth

        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })

        if (nextIndex >= totalCards / 2) {
          setTimeout(() => {
            const resetIndex = nextIndex - (totalCards / 2)
            setCurrentIndex(resetIndex)
            scrollContainer.scrollTo({
              left: resetIndex * cardWidth,
              behavior: 'auto'
            })
          }, 500)
          return nextIndex
        }

        return nextIndex
      })
    }

    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      autoScrollIntervalRef.current = setInterval(scroll, 6000)
    }

    startAutoScroll()

    const handleInteraction = () => {
      isScrolling = false
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      setTimeout(() => {
        isScrolling = true
        const newIndex = Math.round(scrollContainer.scrollLeft / cardWidth)
        setCurrentIndex(newIndex)
        startAutoScroll()
      }, 8000)
    }

    scrollContainer.addEventListener('mouseenter', handleInteraction)
    scrollContainer.addEventListener('touchstart', handleInteraction)

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      scrollContainer.removeEventListener('mouseenter', handleInteraction)
      scrollContainer.removeEventListener('touchstart', handleInteraction)
    }
  }, [trendingLoading, trendingMovies.length])

  // Auto-scroll functionality for popular movies
  useEffect(() => {
    if (!popularContainerRef.current || popularLoading || popularMovies.length === 0) return

    const scrollContainer = popularContainerRef.current
    const cardWidth = 350
    const totalCards = popularMovies.length
    let isScrolling = true

    const scroll = () => {
      if (!isScrolling) return

      setPopularIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalCards
        const scrollPosition = nextIndex * cardWidth

        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })

        if (nextIndex >= totalCards / 2) {
          setTimeout(() => {
            const resetIndex = nextIndex - (totalCards / 2)
            setPopularIndex(resetIndex)
            scrollContainer.scrollTo({
              left: resetIndex * cardWidth,
              behavior: 'auto'
            })
          }, 500)
          return nextIndex
        }

        return nextIndex
      })
    }

    const startAutoScroll = () => {
      if (popularAutoScrollIntervalRef.current) {
        clearInterval(popularAutoScrollIntervalRef.current)
      }
      popularAutoScrollIntervalRef.current = setInterval(scroll, 6000)
    }

    startAutoScroll()

    const handleInteraction = () => {
      isScrolling = false
      if (popularAutoScrollIntervalRef.current) {
        clearInterval(popularAutoScrollIntervalRef.current)
      }
      setTimeout(() => {
        isScrolling = true
        const newIndex = Math.round(scrollContainer.scrollLeft / cardWidth)
        setPopularIndex(newIndex)
        startAutoScroll()
      }, 8000)
    }

    scrollContainer.addEventListener('mouseenter', handleInteraction)
    scrollContainer.addEventListener('touchstart', handleInteraction)

    return () => {
      if (popularAutoScrollIntervalRef.current) {
        clearInterval(popularAutoScrollIntervalRef.current)
      }
      scrollContainer.removeEventListener('mouseenter', handleInteraction)
      scrollContainer.removeEventListener('touchstart', handleInteraction)
    }
  }, [popularLoading, popularMovies.length])

  const handleSearch = async (query) => {
    if (!query) {
      setMovies([])
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setMovies(data.results)
    } catch (error) {
      console.error('Error searching movies:', error)
    }
    setLoading(false)
  }

  const handleScroll = (containerRef, direction, cardWidth = 350) => {
    const container = containerRef.current
    if (!container) return

    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth
    const newScrollPosition = container.scrollLeft + scrollAmount

    // Clear the current interval and start a new one
    if (containerRef === scrollContainerRef && autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      setTimeout(() => {
        const newIndex = Math.round(newScrollPosition / cardWidth)
        setCurrentIndex(newIndex)
        autoScrollIntervalRef.current = setInterval(() => {
          const scroll = () => {
            setCurrentIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % trendingMovies.length
              const scrollPosition = nextIndex * cardWidth
              container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
              })
              return nextIndex
            })
          }
          scroll()
        }, 6000)
      }, 500)
    } else if (containerRef === popularContainerRef && popularAutoScrollIntervalRef.current) {
      clearInterval(popularAutoScrollIntervalRef.current)
      setTimeout(() => {
        const newIndex = Math.round(newScrollPosition / cardWidth)
        setPopularIndex(newIndex)
        popularAutoScrollIntervalRef.current = setInterval(() => {
          const scroll = () => {
            setPopularIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % popularMovies.length
              const scrollPosition = nextIndex * cardWidth
              container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
              })
              return nextIndex
            })
          }
          scroll()
        }, 6000)
      }, 500)
    }

    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    })
  }

  const handleSurprise = async () => {
    setSurpriseLoading(true)
    try {
      // First, get total pages of top rated movies
      const topRatedRes = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      )
      const topRatedData = await topRatedRes.json()
      const totalPages = Math.min(topRatedData.total_pages, 500) // TMDB limits to 500 pages
      
      // Get a random page
      const randomPage = Math.floor(Math.random() * totalPages) + 1
      
      // Fetch the random page
      const randomPageRes = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${randomPage}`
      )
      const randomPageData = await randomPageRes.json()
      
      // Get a random movie from the page
      const randomMovie = randomPageData.results[Math.floor(Math.random() * randomPageData.results.length)]
      
      // Navigate to the movie detail page
      window.location.href = `/movie/${randomMovie.id}`
    } catch (error) {
      console.error('Error fetching random movie:', error)
    } finally {
      setSurpriseLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-grow w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex-shrink-0">
          <SurpriseButton onClick={handleSurprise} loading={surpriseLoading} />
        </div>
      </div>
      
      {/* Search Results */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : movies.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : null}
      
      {/* Popular Movies Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Popular Movies</h2>
        {popularLoading ? (
          <div className="text-center">Loading popular movies...</div>
        ) : (
          <div className="relative group">
            <ScrollButton 
              direction="left" 
              onClick={() => handleScroll(popularContainerRef, 'left')}
            />
            <div 
              ref={popularContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
              }}
            >
              {popularMovies.map((movie, index) => (
                <div 
                  key={`${movie.id}-${index}`} 
                  className="snap-start flex-none w-[300px] md:w-[350px] p-2 transition-transform duration-500"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <ScrollButton 
              direction="right" 
              onClick={() => handleScroll(popularContainerRef, 'right')}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[...Array(popularMovies.length / 2)].map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                    index === popularIndex % (popularMovies.length / 2)
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Trending Movies Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Trending Today</h2>
        {trendingLoading ? (
          <div className="text-center">Loading trending movies...</div>
        ) : (
          <div className="relative group">
            <ScrollButton 
              direction="left" 
              onClick={() => handleScroll(scrollContainerRef, 'left')}
            />
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
              }}
            >
              {trendingMovies.map((movie, index) => (
                <div 
                  key={`${movie.id}-${index}`} 
                  className="snap-start flex-none w-[300px] md:w-[350px] p-2 transition-transform duration-500"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <ScrollButton 
              direction="right" 
              onClick={() => handleScroll(scrollContainerRef, 'right')}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[...Array(trendingMovies.length / 2)].map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                    index === currentIndex % (trendingMovies.length / 2)
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
