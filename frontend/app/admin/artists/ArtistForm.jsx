import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useAuth } from '@/context/auth-context';



export function ArtistForm({ artist, onSubmit, onCancel }) {
  const { user } = useAuth();
  const [genres, setGenres] = useState(artist?.genres || []);
  const [newGenre, setNewGenre] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: artist?.name || '',
      bio: artist?.bio || '',
      image: artist?.image || '',
      genres: artist?.genres || [],
      followers: artist?.followers || 0,
    },
  });

  const addGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      const updatedGenres = [...genres, newGenre.trim()];
      setGenres(updatedGenres);
      setValue('genres', updatedGenres);
      setNewGenre('');
    }
  };

  const removeGenre = (genreToRemove) => {
    const updatedGenres = genres.filter(g => g !== genreToRemove);
    setGenres(updatedGenres);
    setValue('genres', updatedGenres);
  };

  const onFormSubmit = (data) => {
    if (user?.role !== 'admin') {
      alert('Only admins can submit artist data');
      return;
    }
    onSubmit({ ...data, genres });
  };

  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-2xl bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          {artist ? 'Edit Artist' : 'Add New Artist'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="basic" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Details
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Artist Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter artist name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium">Biography</Label>
                <Textarea
                  id="bio"
                  {...register('bio', { required: 'Bio is required' })}
                  placeholder="Enter artist biography"
                  rows={4}
                  className="mt-1"
                />
                {errors.bio && (
                  <p className="text-sm text-red-400 mt-1">{errors.bio.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="followers" className="text-sm font-medium">Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  {...register('followers', { 
                    required: 'Followers is required',
                    min: { value: 0, message: 'Followers must be non-negative' }
                  })}
                  placeholder="Enter number of followers"
                  className="mt-1"
                />
                {errors.followers && (
                  <p className="text-sm text-red-400 mt-1">{errors.followers.message}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-6">
              <div>
                <Label className="text-sm font-medium">Genres</Label>
                <div className="flex gap-2 mb-2 mt-1">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Add a genre"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                  />
                  <Button type="button" onClick={addGenre} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-green-500/20 text-green-400 border-green-500/30">
                      {genre}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-400" 
                        onClick={() => removeGenre(genre)}
                      />
                    </Badge>
                  ))}
                </div>
                {genres.length === 0 && (
                  <p className="text-sm text-red-400 mt-1">At least one genre is required</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="image" className="text-sm font-medium">Profile Image URL</Label>
                <Input
                  id="image"
                  {...register('image', { 
                    required: 'Image URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Must be a valid URL'
                    }
                  })}
                  placeholder="Enter image URL"
                  className="mt-1"
                />
                {errors.image && (
                  <p className="text-sm text-red-400 mt-1">{errors.image.message}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={user?.role !== 'admin'}
            >
              {artist ? 'Update Artist' : 'Create Artist'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}