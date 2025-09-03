
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTryIt = () => {
    navigate('/try');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">GameEngine</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Play. Create. Share.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Instant game runtime for creators and players
        </p>
        
        <Button 
          onClick={handleTryIt}
          size="lg"
          className="text-lg px-12 py-6 h-auto rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Play className="w-5 h-5 mr-2" />
          Try it
        </Button>
      </div>
      
      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>© 2025 GameEngine. Built for creators.</p>
      </footer>
    </div>
  );
};

export default Index;
