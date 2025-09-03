import { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Timer,
  Save,
  Upload,
  Download,
  Maximize2,
  Monitor,
  Cpu,
  Activity,
  Volume2,
  VolumeX,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  User,
  Trophy,
  Share2,
  Home,
  PanelLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useToast } from '@/hooks/use-toast';
import GameCatalog from '@/components/GameCatalog';

interface GameMetadata {
  title: string;
  version: string;
  author: string;
  description: string;
  genre: string;
  rating: number;
}

interface PerformanceStats {
  fps: number;
  cpu: number;
  gpu: number;
  memory: number;
}

const GameRuntime = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [difficulty, setDifficulty] = useState('normal');
  const [sessionTime, setSessionTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [performance, setPerformance] = useState<PerformanceStats>({
    fps: 60,
    cpu: 15,
    gpu: 8,
    memory: 45
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const [gameMetadata, setGameMetadata] = useState<GameMetadata>({
    title: 'Forest Adventure',
    version: '1.2.0',
    author: 'GameDev Studio',
    description: 'An immersive RPG experience in a mystical forest world',
    genre: 'RPG',
    rating: 4.8
  });

  const logAction = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Performance monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformance(prev => ({
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 10)),
        cpu: Math.max(5, Math.min(80, prev.cpu + (Math.random() - 0.5) * 20)),
        gpu: Math.max(2, Math.min(60, prev.gpu + (Math.random() - 0.5) * 15)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 10))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (gameState === 'idle' || gameState === 'paused') {
      setGameState('playing');
      toast({ title: 'Game started' });
      logAction('Game started');
    } else {
      setGameState('paused');
      toast({ title: 'Game paused' });
      logAction('Game paused');
    }
  }, [gameState, toast]);

  const handleReset = useCallback(() => {
    setGameState('idle');
    setSessionTime(0);
    toast({ title: 'Game reset' });
    logAction('Game reset');
  }, [toast]);

  const handleSave = useCallback(() => {
    toast({ title: 'Game saved', description: 'Progress saved to cloud' });
    logAction('Game saved');
  }, [toast]);

  const handleLoad = useCallback(() => {
    toast({ title: 'Game loaded', description: 'Progress restored from cloud' });
    logAction('Game loaded');
  }, [toast]);

  const handleGameSelect = useCallback((game: GameMetadata) => {
    setGameMetadata({
      title: game.title,
      version: game.version,
      author: game.author,
      description: game.description,
      genre: game.genre,
      rating: game.rating
    });
    setGameState('idle');
    setSessionTime(0);
    logAction(`Selected game ${game.title}`);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const LeftPanelContent = () => (
    <div className="p-4 space-y-4">
      {/* Game Metadata */}
      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-game-text">{gameMetadata.title}</CardTitle>
          <div className="flex items-center justify-between text-sm text-game-muted">
            <span>v{gameMetadata.version}</span>
            <span>⭐ {gameMetadata.rating}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-game-muted">{gameMetadata.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-game-muted">by {gameMetadata.author}</span>
            <span className="bg-game-accent px-2 py-1 rounded text-white">{gameMetadata.genre}</span>
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-game-text">Game Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            <Button
              onClick={handlePlayPause}
              className="flex-1 bg-game-accent hover:bg-game-accent/80 text-white"
            >
              {gameState === 'playing' ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {gameState === 'playing' ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-game-border text-game-text hover:bg-game-border"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-game-muted">Difficulty</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="bg-game-bg border-game-border text-game-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-game-panel border-game-border">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="nightmare">Nightmare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="flex-1 border-game-border text-game-text hover:bg-game-border"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              onClick={handleLoad}
              variant="outline"
              size="sm"
              className="flex-1 border-game-border text-game-text hover:bg-game-border"
            >
              <Upload className="w-4 h-4 mr-1" />
              Load
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-game-text flex items-center">
            <Timer className="w-4 h-4 mr-2" />
            Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono text-game-accent">{formatTime(sessionTime)}</div>
          <div className="text-xs text-game-muted mt-1">Session time</div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-game-text flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-game-muted">FPS</div>
              <div className="text-lg font-mono text-game-accent">{Math.round(performance.fps)}</div>
            </div>
            <div>
              <div className="text-game-muted">CPU</div>
              <div className="text-lg font-mono text-game-accent">{Math.round(performance.cpu)}%</div>
            </div>
            <div>
              <div className="text-game-muted">GPU</div>
              <div className="text-lg font-mono text-game-accent">{Math.round(performance.gpu)}%</div>
            </div>
            <div>
              <div className="text-game-muted">Memory</div>
              <div className="text-lg font-mono text-game-accent">{Math.round(performance.memory)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Map */}
      <Collapsible open={controlsOpen} onOpenChange={setControlsOpen}>
        <Card className="bg-game-panel border-game-border">
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-game-text hover:bg-game-border p-0">
                <span className="text-base font-semibold">Controls</span>
                {controlsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-game-muted">WASD</div>
                <div className="text-game-text">Move</div>
                <div className="text-game-muted">Space</div>
                <div className="text-game-text">Jump</div>
                <div className="text-game-muted">E</div>
                <div className="text-game-text">Interact</div>
                <div className="text-game-muted">Shift</div>
                <div className="text-game-text">Run</div>
                <div className="text-game-muted">Tab</div>
                <div className="text-game-text">Inventory</div>
                <div className="text-game-muted">Esc</div>
                <div className="text-game-text">Menu</div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Help Section */}
      <Collapsible open={helpOpen} onOpenChange={setHelpOpen}>
        <Card className="bg-game-panel border-game-border">
          <CardHeader className="pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-game-text hover:bg-game-border p-0">
                <span className="text-base font-semibold flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </span>
                {helpOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-2 text-sm text-game-muted">
              <p>• Use WASD to move around the forest</p>
              <p>• Collect items by walking over them</p>
              <p>• Talk to NPCs with the E key</p>
              <p>• Check your inventory with Tab</p>
              <p>• Save your progress regularly</p>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Console Logs */}
      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-game-text">Console</CardTitle>
        </CardHeader>
        <CardContent className="bg-black/40 rounded-md p-2 h-32 overflow-y-auto text-xs font-mono space-y-1 text-game-text">
          {logs.length ? (
            logs.map((log, i) => <div key={i}>{log}</div>)
          ) : (
            <div className="text-game-muted">No logs</div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-screen bg-game-bg text-game-text">
      {/* Navigation Header */}
      <div className="bg-game-panel border-b border-game-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-game-text hover:bg-game-border"
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <div className="hidden md:block">
              <GameCatalog onGameSelect={handleGameSelect} selectedGame={gameMetadata} />
            </div>
            <h1 className="text-lg font-semibold md:hidden">{gameMetadata.title}</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="text-game-text hover:bg-game-border"
            >
              {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline ml-1">
                {gameState === 'playing' ? 'Pause' : 'Play'}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-game-text hover:bg-game-border"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(true)}
              className="text-game-text hover:bg-game-border md:hidden"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel - Game Controls & Info */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="hidden md:block">
          <div className="h-full bg-game-panel border-r border-game-border overflow-y-auto">
            <LeftPanelContent />
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-game-border hover:bg-game-accent transition-colors hidden md:block" />

        {/* Right Panel - Game Runtime */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full bg-game-bg relative">
            {/* Game Canvas Area */}
            <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-400 relative overflow-hidden">
              {/* Sky and ground */}
              <div className="absolute bottom-0 w-full h-1/2 bg-green-600"></div>
              
              {/* Trees */}
              <div className="absolute bottom-20 left-1/4 transform -translate-x-1/2">
                <div className="w-24 h-32 bg-green-800 clip-path-triangle relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-4 h-8 bg-amber-800"></div>
                </div>
              </div>
              
              <div className="absolute bottom-32 right-1/4 transform translate-x-1/2">
                <div className="w-16 h-24 bg-green-800 clip-path-triangle relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-3 h-6 bg-amber-800"></div>
                </div>
              </div>
              
              <div className="absolute bottom-16 right-10">
                <div className="w-20 h-28 bg-green-800 clip-path-triangle relative">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-4 h-7 bg-amber-800"></div>
                </div>
              </div>

              {/* Game state overlay */}
              {gameState === 'idle' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Play</h3>
                    <p className="text-lg">Click Play to start your adventure</p>
                  </div>
                </div>
              )}

              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Pause className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Game Paused</h3>
                    <p className="text-lg">Click Play to continue</p>
                  </div>
                </div>
              )}
            </div>

            {/* Game Controls Overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 border-white/20 text-white hover:bg-black/70"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="bg-black/50 border-white/20 text-white hover:bg-black/70"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Game Stats Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  <span>{Math.round(performance.fps)} FPS</span>
                </div>
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  <span>{formatTime(sessionTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)}></div>
          <div className="relative w-3/4 max-w-xs h-full bg-game-panel border-r border-game-border overflow-y-auto">
            <LeftPanelContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRuntime;