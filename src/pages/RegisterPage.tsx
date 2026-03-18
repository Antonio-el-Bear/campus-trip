import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Camera } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClassificationPicker from '@/components/ClassificationPicker';
import CountryPicker from '@/components/CountryPicker';

const RegisterPage = () => {
  const [selectedClassifications, setSelectedClassifications] = useState<
    string[]
  >([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [consultancyAvailable, setConsultancyAvailable] = useState(false);
  const [consultancyType, setConsultancyType] = useState('free');
  const [consultancyRate, setConsultancyRate] = useState('');
  const [consultancyCurrency, setConsultancyCurrency] = useState('EUR');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Maximum file size is 2 MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleClassification = (value: string) => {
    setSelectedClassifications((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      if (prev.length >= 10) return prev;
      return [...prev, value];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — requires backend
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="bg-card border border-border rounded-lg p-8 w-full max-w-lg">
          <h1 className="font-display text-xl font-bold text-foreground mb-1">
            Register
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Create your TravelRecord member profile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Picture */}
            <div>
              <Label className="text-xs font-medium mb-2 block">
                Profile Picture
              </Label>
              <div className="flex items-center gap-4">
                <div
                  className="relative group w-16 h-16 rounded-lg overflow-hidden cursor-pointer border border-border"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Camera className="h-5 w-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">
                    Click to upload a photo
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Max 2 MB · JPG, PNG, or WebP
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-xs font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Helena"
                  className="mt-1 font-body"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-xs font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Vasquez"
                  className="mt-1 font-body"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 font-body"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 font-body"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-xs font-medium">
                Profile Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your travel experience and expertise..."
                className="mt-1 font-body"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">
                Trip Classifications{' '}
                <span className="text-muted-foreground">(select up to 10)</span>
              </Label>
              <ClassificationPicker
                selected={selectedClassifications}
                onToggle={toggleClassification}
                max={10}
              />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">
                Countries Visited
              </Label>
              <CountryPicker
                selected={selectedCountries}
                onToggle={(c) =>
                  setSelectedCountries((prev) =>
                    prev.includes(c)
                      ? prev.filter((v) => v !== c)
                      : [...prev, c]
                  )
                }
              />
            </div>

            {/* Consultancy Section */}
            <div className="border border-border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">
                    Available for Consultancy & Assistance
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Offer guidance to users interested in your documented trips
                  </p>
                </div>
                <Switch
                  checked={consultancyAvailable}
                  onCheckedChange={setConsultancyAvailable}
                />
              </div>

              {consultancyAvailable && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <Label className="text-xs font-medium">
                      Consultancy Type
                    </Label>
                    <Select
                      value={consultancyType}
                      onValueChange={setConsultancyType}
                    >
                      <SelectTrigger className="mt-1 font-body text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="both">Both (Free & Paid)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(consultancyType === 'paid' ||
                    consultancyType === 'both') && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium">
                          Rate per Session
                        </Label>
                        <Input
                          type="number"
                          value={consultancyRate}
                          onChange={(e) => setConsultancyRate(e.target.value)}
                          placeholder="e.g. 45"
                          className="mt-1 font-body"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Currency</Label>
                        <Select
                          value={consultancyCurrency}
                          onValueChange={setConsultancyCurrency}
                        >
                          <SelectTrigger className="mt-1 font-body text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CHF">CHF</SelectItem>
                            <SelectItem value="AUD">AUD (A$)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-xs font-medium">
                      Consultancy Description
                    </Label>
                    <Textarea
                      placeholder="Describe what kind of consultancy or assistance you offer..."
                      className="mt-1 font-body"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body"
            >
              Create Account
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4 font-body">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default RegisterPage;
