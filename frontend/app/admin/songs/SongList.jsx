import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

export function SongList({ songs, onAdd, onEdit, onDelete, onView }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSongs = songs.filter((song) =>
    [song.title, song.artist, song.genre].some(
      (field) => typeof field === "string" && field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSongs = filteredSongs.slice(startIndex, startIndex + itemsPerPage);

  console.log("Songs:", songs, "Filtered songs:", filteredSongs, "Paginated songs:", paginatedSongs);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Songs
          </h1>
          <p className="text-muted-foreground text-lg">Manage your music songs</p>
        </div>
        <Button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25"
        >
          <Plus className="h-4 w-4" />
          Add Song
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-2">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">All Songs ({filteredSongs.length})</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search songs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSongs.length > 0 ? (
                paginatedSongs.map((song) => (
                  <TableRow key={song.id} className="hover:bg-muted/50 border-border transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {song.coverArt && (
                          <img
                            src={song.coverArt}
                            alt={song.title || "Song"}
                            className="w-12 h-12 object-cover rounded-md border border-border"
                            onError={(e) => (e.target.src = "/placeholder.png")}
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{song.title || "N/A"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{song.artist || "N/A"}</TableCell>
                    <TableCell>{song.album || "N/A"}</TableCell>
                    <TableCell>{song.releaseYear || "N/A"}</TableCell>
                    <TableCell>
                      {song.duration
                        ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, "0")}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        {song.genre || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(song)}
                          className="hover:bg-blue-500/20 hover:text-blue-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(song)}
                          className="hover:bg-green-500/20 hover:text-green-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(song.id, song.title || "Song")}
                          className="hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No songs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}