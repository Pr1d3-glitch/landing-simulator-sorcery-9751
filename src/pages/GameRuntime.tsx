import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Volume2,
  VolumeX,
  PanelLeft,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useToast } from '@/hooks/use-toast';

interface PerformanceStats {
  fps: number;
  cpu: number;
  memory: number;
}

const genres = ['platformer', 'runner', 'shooter', 'RPG', 'puzzle'];
const artStyles = ['pixel', 'flat', 'low-poly'];
const templates = ['blank', 'endless', 'boss-fight'];

const buildSteps = [
  'parse',
  'design-doc',
  'codegen',
  'type-check',
  'bundle',
  'asset bake',
];

const GameRuntime = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [sessionTime, setSessionTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [performance, setPerformance] = useState<PerformanceStats>({
    fps: 60,
    cpu: 15,
    memory: 45,
  });
  const [showSidebar, setShowSidebar] = useState(false);

  // prompt studio state
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('blank');
  const [genre, setGenre] = useState<string | null>(null);
  const [artStyle, setArtStyle] = useState('pixel');
  const [difficulty, setDifficulty] = useState('normal');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [seed, setSeed] = useState('');
  const [camera, setCamera] = useState('side');
  const [physics, setPhysics] = useState('arcade');
  const [inputScheme, setInputScheme] = useState('keyboard');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);

  const runBuild = useCallback(async () => {
    setBuildLogs([]);
    for (const step of buildSteps) {
      setBuildLogs((prev) => [...prev, `▶ ${step}`]);
      await new Promise((r) => setTimeout(r, 300));
    }
    toast({ title: 'Build complete' });
  }, [toast]);

  const handleGenerate = useCallback(() => {
    runBuild();
  }, [runBuild]);

  const handleRefine = useCallback(() => {
    setPrompt((p) => `${p}\n`);
    runBuild();
  }, [runBuild]);

  const handleRegenerate = useCallback(() => {
    runBuild();
  }, [runBuild]);

  const handleSaveVersion = useCallback(() => {
    toast({ title: 'Version saved' });
  }, [toast]);

  const handleExport = useCallback(() => {
    toast({ title: 'Exported zip' });
  }, [toast]);

  const handleDeploy = useCallback(() => {
    toast({ title: 'Deployment started' });
  }, [toast]);

  // session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => setSessionTime((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // performance simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformance((prev) => ({
        fps: Math.max(30, Math.min(60, prev.fps + (Math.random() - 0.5) * 10)),
        cpu: Math.max(5, Math.min(80, prev.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() - 0.5) * 10)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const StudioPanel = () => (
    <div className="p-4 space-y-4">
      <Card className="bg-game-panel border-game-border">
        <CardHeader>
          <CardTitle className="text-game-text">Prompt & Build Studio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-game-muted">Template</label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger className="bg-game-bg border-game-border text-game-text">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-game-panel border-game-border">
                {templates.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-game-bg border-game-border text-game-text"
            rows={6}
            placeholder="Describe your game..."
          />

          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Badge
                key={g}
                variant={genre === g ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setGenre(g)}
              >
                {g}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-game-muted">Art style</label>
              <Select value={artStyle} onValueChange={setArtStyle}>
                <SelectTrigger className="bg-game-bg border-game-border text-game-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-game-panel border-game-border">
                  {artStyles.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-game-muted">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-game-bg border-game-border text-game-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-game-panel border-game-border">
                  <SelectItem value="easy">easy</SelectItem>
                  <SelectItem value="normal">normal</SelectItem>
                  <SelectItem value="hard">hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
              <span className="text-sm text-game-text">Audio</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={sfxEnabled} onCheckedChange={setSfxEnabled} />
              <span className="text-sm text-game-text">SFX</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-game-muted">Seed</label>
            <Input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="bg-game-bg border-game-border text-game-text"
            />
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-game-text hover:bg-game-border p-0">
                <span>Advanced</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <Input
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                placeholder="camera"
                className="bg-game-bg border-game-border text-game-text"
              />
              <Input
                value={physics}
                onChange={(e) => setPhysics(e.target.value)}
                placeholder="physics"
                className="bg-game-bg border-game-border text-game-text"
              />
              <Input
                value={inputScheme}
                onChange={(e) => setInputScheme(e.target.value)}
                placeholder="input scheme"
                className="bg-game-bg border-game-border text-game-text"
              />
            </CollapsibleContent>
          </Collapsible>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleGenerate} className="bg-game-accent text-white hover:bg-game-accent/80">
              Generate
            </Button>
            <Button size="sm" variant="outline" onClick={handleRefine} className="border-game-border text-game-text">
              Refine
            </Button>
            <Button size="sm" variant="outline" onClick={handleRegenerate} className="border-game-border text-game-text">
              Regenerate
            </Button>
            <Button size="sm" variant="outline" className="border-game-border text-game-text">
              Diff
            </Button>
            <Button size="sm" variant="outline" onClick={handleSaveVersion} className="border-game-border text-game-text">
              Save Version
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport} className="border-game-border text-game-text">
              Export Zip
            </Button>
            <Button size="sm" variant="outline" onClick={handleDeploy} className="border-game-border text-game-text">
              Deploy
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-game-text">Build Log</CardTitle>
        </CardHeader>
        <CardContent className="bg-black/40 rounded-md p-2 h-32 overflow-y-auto text-xs font-mono space-y-1 text-game-text">
          {buildLogs.length ? buildLogs.map((l, i) => <div key={i}>{l}</div>) : <div className="text-game-muted">No build yet</div>}
        </CardContent>
      </Card>

      <Card className="bg-game-panel border-game-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-game-text">Resources</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-game-muted">FPS</div>
            <div className="text-lg font-mono text-game-accent">{Math.round(performance.fps)}</div>
          </div>
          <div>
            <div className="text-game-muted">CPU</div>
            <div className="text-lg font-mono text-game-accent">{Math.round(performance.cpu)}%</div>
          </div>
          <div>
            <div className="text-game-muted">Memory</div>
            <div className="text-lg font-mono text-game-accent">{Math.round(performance.memory)}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-screen bg-game-bg text-game-text">
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
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGameState((s) => (s === 'playing' ? 'paused' : 'playing'))}
              className="text-game-text hover:bg-game-border"
            >
              {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline ml-1">{gameState === 'playing' ? 'Pause' : 'Play'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGameState('idle')}
              className="text-game-text hover:bg-game-border"
            >
              <RotateCcw className="w-4 h-4" />
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
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="hidden md:block">
          <div className="h-full bg-game-panel border-r border-game-border overflow-y-auto">
            <StudioPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-game-border hover:bg-game-accent transition-colors hidden md:block" />
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full bg-game-bg relative">
            <div className="w-full h-full bg-gradient-to-b from-arcade-purple to-arcade-pink relative overflow-hidden">
              {gameState === 'idle' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Ready to Play</h3>
                    <p className="text-lg">Click Play to start</p>
                  </div>
                </div>
              )}
              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Pause className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Paused</h3>
                    <p className="text-lg">Click Play to continue</p>
                  </div>
                </div>
              )}
            </div>
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
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span>{Math.round(performance.fps)} FPS</span>
                </div>
                <div className="flex items-center">
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
            <StudioPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRuntime;
