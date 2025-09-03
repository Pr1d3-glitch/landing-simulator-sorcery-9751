import { useState } from 'react';
import { Play, Star, Download, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  title: string;
  description: string;
  author: string;
  version: string;
  genre: string;
  rating: number;
  downloads: number;
  thumbnail: string;
  size: string;
  lastUpdated: string;
}

interface GameCatalogProps {
  onGameSelect: (game: Game) => void;
  selectedGame?: { title: string; version: string; author: string; description: string; genre: string; rating: number; };
}

const sampleGames: Game[] = [
  {
    id: 'forest-adventure',
    title: 'Forest Adventure',
    description: 'An immersive RPG experience in a mystical forest world with magical creatures and ancient secrets.',
    author: 'GameDev Studio',
    version: '1.2.0',
    genre: 'RPG',
    rating: 4.8,
    downloads: 15420,
    thumbnail: '/api/placeholder/300/200',
    size: '45.2 MB',
    lastUpdated: '2025-01-15'
  },
  {
    id: 'space-explorer',
    title: 'Space Explorer',
    description: 'Navigate through the cosmos, discover new planets, and build your intergalactic empire.',
    author: 'Cosmic Games',
    version: '2.1.5',
    genre: 'Strategy',
    rating: 4.6,
    downloads: 8930,
    thumbnail: '/api/placeholder/300/200',
    size: '67.8 MB',
    lastUpdated: '2025-01-12'
  },
  {
    id: 'pixel-platformer',
    title: 'Pixel Platformer',
    description: 'Classic 2D platformer with pixel art graphics, challenging levels, and retro soundtrack.',
    author: 'Retro Studios',
    version: '1.0.3',
    genre: 'Platformer',
    rating: 4.7,
    downloads: 12650,
    thumbnail: '/api/placeholder/300/200',
    size: '28.5 MB',
    lastUpdated: '2025-01-10'
  },
  {
    id: 'puzzle-master',
    title: 'Puzzle Master',
    description: 'Mind-bending puzzles that will challenge your logic and problem-solving skills.',
    author: 'Brain Games Inc',
    version: '1.5.2',
    genre: 'Puzzle',
    rating: 4.9,
    downloads: 23180,
    thumbnail: '/api/placeholder/300/200',
    size: '15.7 MB',
    lastUpdated: '2025-01-08'
  }
];

const GameCatalog = ({ onGameSelect, selectedGame }: GameCatalogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleGameSelect = (game: Game) => {
    onGameSelect(game);
    setIsOpen(false);
    toast({
      title: `Loading ${game.title}`,
      description: 'Game is being loaded into the runtime...'
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const zipFiles = files.filter(file => file.name.endsWith('.zip'));
    
    if (zipFiles.length > 0) {
      toast({
        title: 'Game Upload',
        description: `Processing ${zipFiles[0].name}...`
      });
      // In a real implementation, this would validate and process the game files
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .zip file containing your game.',
        variant: 'destructive'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-game-panel border-game-border text-game-text hover:bg-game-border"
        >
          {selectedGame ? `${selectedGame.title} v${selectedGame.version}` : 'Select Game'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] bg-game-panel border-game-border text-game-text">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Game Catalog</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {/* Upload Area */}
          <div
            className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-game-accent bg-game-accent/10' 
                : 'border-game-border hover:border-game-accent/50'
            }`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-game-muted" />
            <p className="text-game-text">Drag and drop a .zip file here, or</p>
            <Button variant="ghost" className="mt-2 text-game-accent hover:bg-game-accent/10">
              Browse Files
            </Button>
          </div>

          {/* Game Grid */}
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleGames.map((game) => (
                <Card 
                  key={game.id} 
                  className={`bg-game-bg border-game-border cursor-pointer transition-all hover:border-game-accent ${
                    selectedGame?.title === game.title ? 'border-game-accent ring-1 ring-game-accent' : ''
                  }`}
                  onClick={() => handleGameSelect(game)}
                >
                  <CardHeader className="pb-2">
                    <div className="aspect-video bg-gradient-to-br from-game-accent/20 to-game-accent/5 rounded-lg mb-3 flex items-center justify-center">
                      <Play className="w-8 h-8 text-game-accent" />
                    </div>
                    <CardTitle className="text-base text-game-text truncate">{game.title}</CardTitle>
                    <div className="flex items-center justify-between text-xs text-game-muted">
                      <span>by {game.author}</span>
                      <span className="bg-game-accent px-2 py-1 rounded text-white">{game.genre}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-game-muted line-clamp-2">{game.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-game-text">{game.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3 text-game-muted" />
                        <span className="text-game-muted">{game.downloads.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-game-muted">
                      <span>v{game.version}</span>
                      <span>{game.size}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full bg-game-accent hover:bg-game-accent/80 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGameSelect(game);
                      }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Load Game
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameCatalog;