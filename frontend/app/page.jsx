import FeaturedSection from "@/components/featured-section"
import NewReleases from "@/components/home/new-releases"
import RecommendedPlaylists from "@/components/playlist/recommended-playlists" 
import TopArtists from "@/components/home/top-artists"

export default function Home() {
  return (
    <div className="space-y-8 pb-24">
      <FeaturedSection />
      <RecommendedPlaylists />
      <NewReleases />
      <TopArtists />
    </div>
  )
}
