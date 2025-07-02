import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FaImage, FaMusic } from "react-icons/fa";

export function SongView({ song, onClose }) {
  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          View Song: {song?.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="basic" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-foreground">Title</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {song?.title || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Artist</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {song?.artist || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Album</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {song?.album || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Release Year</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {song?.releaseYear || "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Duration</Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2">
                {song?.duration
                  ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, "0")}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Genre</Label>
              <div className="mt-1">
                {song?.genre ? (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {song.genre}
                  </Badge>
                ) : (
                  <p className="text-foreground bg-background border border-border rounded-md p-2">N/A</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 mt-6">
            <div>
              <Label className="text-sm font-medium text-foreground flex items-center">
                <FaImage className="mr-2 text-blue-400" /> Cover Art
              </Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2 break-all">
                {song?.coverArt || "N/A"}
              </p>
              {song?.coverArt && (
                <div className="mt-2">
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="max-w-xs rounded-md border border-border"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground flex items-center">
                <FaMusic className="mr-2 text-blue-400" /> Audio
              </Label>
              <p className="mt-1 text-foreground bg-background border border-border rounded-md p-2 break-all">
                {song?.audioUrl || "N/A"}
              </p>
              {song?.audioUrl && (
                <audio controls src={song.audioUrl} className="mt-2 w-full bg-background rounded-lg p-1">
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}