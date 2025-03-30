'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RefreshCw } from 'lucide-react';
import type { Database } from '@/lib/types/database';
import Image from 'next/image';

type Template = {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  is_premium: boolean;
};

type Wedding = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
};

type Invitation = {
  id: string;
  template_id: string;
  custom_message: string | null;
  accent_color: string;
  font_choice: string;
  slug: string;
};

export default function InvitationDesignPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    template_id: '',
    custom_message: '',
    accent_color: '#8B4513',
    font_choice: 'Playfair Display',
    slug: '',
  });

  const supabase = createClientComponentClient<Database>();
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Get user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }
        
        // Fetch templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('invitation_templates')
          .select('*');
        
        if (templatesError) throw templatesError;
        setTemplates(templatesData || []);
        
        // Fetch user's wedding
        const { data: weddingData, error: weddingError } = await supabase
          .from('weddings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (weddingError && weddingError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is fine if no wedding exists
          throw weddingError;
        }
        
        if (weddingData) {
          setWedding(weddingData);
          
          // Fetch invitation if it exists
          const { data: invitationData, error: invitationError } = await supabase
            .from('invitations')
            .select('*')
            .eq('wedding_id', weddingData.id)
            .limit(1)
            .single();
          
          if (invitationError && invitationError.code !== 'PGRST116') {
            throw invitationError;
          }
          
          if (invitationData) {
            setInvitation(invitationData);
            setFormData({
              template_id: invitationData.template_id,
              custom_message: invitationData.custom_message || '',
              accent_color: invitationData.accent_color,
              font_choice: invitationData.font_choice,
              slug: invitationData.slug,
            });
            setPreviewUrl(`/invitation/${invitationData.slug}`);
          } else {
            // Generate a random slug for new invitations
            const newSlug = generateSlug();
            setFormData(prev => ({ ...prev, slug: newSlug }));
            setPreviewUrl(`/invitation/${newSlug}`);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [supabase]);
  
  // Generate a random slug
  const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Regenerate slug
  const handleRegenerateSlug = () => {
    const newSlug = generateSlug();
    setFormData(prev => ({ ...prev, slug: newSlug }));
    setPreviewUrl(`/invitation/${newSlug}`);
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Update preview URL if slug changes
    if (field === 'slug') {
      setPreviewUrl(`/invitation/${value}`);
    }
  };
  
  // Save invitation
  const handleSave = async () => {
    if (!wedding || !formData.template_id || !formData.slug) return;
    
    setSaving(true);
    
    try {
      if (invitation) {
        // Update existing invitation
        const { error } = await supabase
          .from('invitations')
          .update({
            template_id: formData.template_id,
            custom_message: formData.custom_message || null,
            accent_color: formData.accent_color,
            font_choice: formData.font_choice,
            slug: formData.slug,
          })
          .eq('id', invitation.id);
        
        if (error) throw error;
      } else {
        // Create new invitation
        const { data, error } = await supabase
          .from('invitations')
          .insert({
            wedding_id: wedding.id,
            template_id: formData.template_id,
            custom_message: formData.custom_message || null,
            accent_color: formData.accent_color,
            font_choice: formData.font_choice,
            slug: formData.slug,
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setInvitation(data[0]);
        }
      }
      
      alert('Invitation saved successfully!');
    } catch (error) {
      console.error('Error saving invitation:', error);
      alert('Error saving invitation. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Font options
  const fontOptions = [
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Dancing Script', label: 'Dancing Script' },
    { value: 'Great Vibes', label: 'Great Vibes' },
  ];

  if (!wedding) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Create Your Wedding First</h1>
        <p className="mb-6">You need to set up your wedding details before designing an invitation.</p>
        <Button asChild>
          <a href="/dashboard/settings">Set Up Wedding</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Design Your Invitation</h1>
          <p className="text-gray-500 mt-1">
            Customize your wedding invitation
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button variant="outline" asChild>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              Preview
            </a>
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.template_id || !formData.slug || saving}
          >
            {saving ? 'Saving...' : invitation ? 'Update Invitation' : 'Create Invitation'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select a Template</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.template_id}
                onValueChange={(value) => handleChange('template_id', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      formData.template_id === template.id
                        ? 'border-rose-500 ring-2 ring-rose-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleChange('template_id', template.id)}
                  >
                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                      {template.thumbnail_url ? (
                        <Image
                          src={template.thumbnail_url}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400">No preview</div>
                      )}
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          {template.description && (
                            <p className="text-sm text-gray-500">{template.description}</p>
                          )}
                        </div>
                        <RadioGroupItem
                          value={template.id}
                          id={`template-${template.id}`}
                          className="mt-1"
                        />
                      </div>
                      
                      {template.is_premium && (
                        <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          Premium
                        </span>
                      )}
                    </div>
                    
                    {formData.template_id === template.id && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        {/* Customization */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customize</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="invitation-message">Personal Message</Label>
                <Textarea
                  id="invitation-message"
                  value={formData.custom_message}
                  onChange={(e) => handleChange('custom_message', e.target.value)}
                  placeholder="Add a personal note to your invitation..."
                  className="h-32 mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="accent-color"
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => handleChange('accent_color', e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => handleChange('accent_color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="font-choice">Font Style</Label>
                <select
                  id="font-choice"
                  value={formData.font_choice}
                  onChange={(e) => handleChange('font_choice', e.target.value)}
                  className="w-full mt-1 p-2 border border-input rounded-md"
                >
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="invitation-url">Invitation URL</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="invitation-url"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRegenerateSlug}
                    size="icon"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                {formData.slug && (
                  <p className="mt-2 text-sm text-gray-500 break-all">
                    {`${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/invitation/${formData.slug}`}
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  disabled={!formData.template_id || !formData.slug || saving}
                  className="w-full"
                >
                  {saving ? 'Saving...' : invitation ? 'Update Invitation' : 'Create Invitation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}