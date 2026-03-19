import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import SearchPage from './pages/SearchPage';
import TripDetail from './pages/TripDetail';
import MemberProfile from './pages/MemberProfile';
import DirectoryPage from './pages/DirectoryPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TripEditor from './pages/TripEditor';
import MessagesPage from './pages/MessagesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ResultsPage from './pages/ResultsPage';
import AITripBuilder from './pages/AITripBuilder';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SpeedInsights />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          <Route path="/trip/new" element={<TripEditor />} />
          <Route path="/member/:id" element={<MemberProfile />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/ai-trip-builder" element={<AITripBuilder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
