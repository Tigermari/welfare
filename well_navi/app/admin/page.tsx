'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://rvisbxmyjeawkexzbjzz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aXNieG15amVhd2tleHpianp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MzE5ODMsImV4cCI6MjA1NjIwNzk4M30.eEjvbeZbLJ0Zhawf_rku7yqXwgznpGx1llSAmoGwuBM"
);
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    Scheme_Name: '',
    Description: '',
    Benefits: '',
    Eligibility_Criteria: '',
    Documents_Required: '',
    Application_Process: '',
    Caste: '',
    Income: '',
    Gender: '',
    State: 'Tamil Nadu',
    District: 'For All TN Districts'
  });
  const validateScheme = (scheme: any): string | null => {
    if (!scheme.Scheme_Name) return 'Scheme name is required';
    if (!scheme.Description) return 'Description is required';
    if (!scheme.Benefits) return 'Benefits are required';
    if (!scheme.Eligibility_Criteria) return 'Eligibility criteria is required';
    if (!scheme.Documents_Required) return 'Required documents must be specified';
    if (!scheme.Caste) return 'Caste category is required';
    if (!scheme.Income) return 'Income limit is required';
    if (!scheme.Gender) return 'Gender criteria is required';
    if (!scheme.State) return 'State is required';
    if (!scheme.District) return 'District is required';
    
    if (isNaN(Number(scheme.Income)) || Number(scheme.Income) < 0) {
      return 'Income must be a positive number';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Validate form data
      const validationError = validateScheme(formData);
      if (validationError) {
        setMessage({ type: 'error', text: validationError });
        setIsLoading(false);
        return;
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('Schemes')
        .insert([{
          ...formData,
          Income: parseInt(formData.Income) // Convert Income to number
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Scheme added successfully!' });
      // Reset form
      setFormData({
        Scheme_Name: '',
        Description: '',
        Benefits: '',
        Eligibility_Criteria: '',
        Documents_Required: '',
        Application_Process: '',
        Caste: '',
        Income: '',
        Gender: '',
        State: 'Tamil Nadu',
        District: 'For All TN Districts'
      });
    } catch (error: any) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to add scheme. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
        <div className="container mx-auto flex items-center justify-between px-6 relative z-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">Admin Dashboard</h2>
            <p className="text-indigo-100">Manage welfare schemes and eligibility criteria</p>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => router.push("/")}
            className="hover:bg-white/90 transition-colors"
          >
            Back 
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-12 px-6 max-w-7xl">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <Tabs defaultValue="add" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto bg-white/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="add" className="text-lg py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Add Scheme
            </TabsTrigger>
            <TabsTrigger value="edit" className="text-lg py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Edit Scheme
            </TabsTrigger>
          </TabsList>
            
          <TabsContent value="add">
            <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-8">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Scheme</h1>
                    <p className="text-gray-600">Create a new welfare scheme with detailed information and eligibility criteria</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Basic Information Section */}
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-700 border-b pb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h2>Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="Scheme_Name" className="text-base font-medium">
                              Scheme Name
                            </Label>
                            <Input
                              id="Scheme_Name"
                              name="Scheme_Name"
                              value={formData.Scheme_Name}
                              onChange={handleChange}
                              className="w-full transition-shadow focus:ring-2 focus:ring-indigo-500"
                              required
                              placeholder="Enter scheme name"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-700 border-b pb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h2>Scheme Details</h2>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="Description" className="text-base font-medium">
                            Description
                          </Label>
                          <textarea
                            id="Description"
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            required
                            placeholder="Provide a detailed description of the scheme"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="Benefits" className="text-base font-medium">
                            Benefits
                          </Label>
                          <textarea
                            id="Benefits"
                            name="Benefits"
                            value={formData.Benefits}
                            onChange={handleChange}
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            required
                            placeholder="List all benefits provided by the scheme"
                          />
                        </div>
                      </div>

                      {/* Eligibility Section */}
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-700 border-b pb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h2>Eligibility & Requirements</h2>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="Eligibility_Criteria" className="text-base font-medium">
                            Eligibility Criteria
                          </Label>
                          <textarea
                            id="Eligibility_Criteria"
                            name="Eligibility_Criteria"
                            value={formData.Eligibility_Criteria}
                            onChange={handleChange}
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            required
                            placeholder="Specify who is eligible for this scheme"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="Documents_Required" className="text-base font-medium">
                            Documents Required
                          </Label>
                          <textarea
                            id="Documents_Required"
                            name="Documents_Required"
                            value={formData.Documents_Required}
                            onChange={handleChange}
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            required
                            placeholder="List all required documents"
                          />
                        </div>
                      </div>

                      {/* Criteria Section */}
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-700 border-b pb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <h2>Demographic Criteria</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="Caste" className="text-base font-medium">
                              Caste Category
                            </Label>
                            <Select onValueChange={(value) => handleSelectChange('Caste', value)}>
                              <SelectTrigger className="w-full focus:ring-2 focus:ring-indigo-500 transition-shadow">
                                <SelectValue placeholder="Select caste category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="OBC">OBC</SelectItem>
                                <SelectItem value="SC">SC</SelectItem>
                                <SelectItem value="ST">ST</SelectItem>
                                <SelectItem value="DNC">DNC</SelectItem>
                                <SelectItem value="MBC">MBC</SelectItem>
                                <SelectItem value="BC">BC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="Income" className="text-base font-medium">
                              Annual Income Limit (₹)
                            </Label>
                            <Input
                              id="Income"
                              name="Income"
                              type="number"
                              value={formData.Income}
                              onChange={handleChange}
                              className="w-full focus:ring-2 focus:ring-indigo-500 transition-shadow"
                              required
                              placeholder="Enter maximum income limit"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="Gender" className="text-base font-medium">
                              Gender
                            </Label>
                            <Select onValueChange={(value) => handleSelectChange('Gender', value)}>
                              <SelectTrigger className="w-full focus:ring-2 focus:ring-indigo-500 transition-shadow">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                                <SelectItem value="All">All</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="State" className="text-base font-medium">
                              State
                            </Label>
                            <Select 
                              onValueChange={(value) => handleSelectChange('State', value)}
                              
                            >
                              <SelectTrigger className="w-full focus:ring-2 focus:ring-indigo-500 transition-shadow">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="District" className="text-base font-medium">
                              District
                            </Label>
                            <Select 
                              onValueChange={(value) => handleSelectChange('District', value)}
                              
                            >
                              <SelectTrigger className="w-full focus:ring-2 focus:ring-indigo-500 transition-shadow">
                                <SelectValue placeholder="Select district" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="For All TN Districts">For all TN Districts</SelectItem>
                                
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        type="submit" 
                        className="w-full max-w-md mx-auto block py-6 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding Scheme...' : 'Add Scheme'}
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h1 className="text-3xl font-bold text-gray-800">Edit Existing Schemes</h1>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    This feature is coming soon. You'll be able to edit and manage existing welfare schemes here.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                  >
                    Get notified when it's ready
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
