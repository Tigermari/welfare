'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPage() {
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
    State: '',
    District: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/schemes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Scheme added successfully!');
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
          State: '',
          District: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add scheme');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardContent className="p-6">
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="add">Add Scheme</TabsTrigger>
              <TabsTrigger value="edit">Edit Scheme</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="Scheme_Name">Scheme Name</Label>
                    <Input
                      id="Scheme_Name"
                      name="Scheme_Name"
                      value={formData.Scheme_Name}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Description">Description</Label>
                    <textarea
                      id="Description"
                      name="Description"
                      value={formData.Description}
                      onChange={handleChange}
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Benefits">Benefits</Label>
                    <textarea
                      id="Benefits"
                      name="Benefits"
                      value={formData.Benefits}
                      onChange={handleChange}
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Eligibility_Criteria">Eligibility Criteria</Label>
                    <textarea
                      id="Eligibility_Criteria"
                      name="Eligibility_Criteria"
                      value={formData.Eligibility_Criteria}
                      onChange={handleChange}
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Documents_Required">Documents Required</Label>
                    <textarea
                      id="Documents_Required"
                      name="Documents_Required"
                      value={formData.Documents_Required}
                      onChange={handleChange}
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Application_Process">Application Process</Label>
                    <textarea
                      id="Application_Process"
                      name="Application_Process"
                      value={formData.Application_Process}
                      onChange={handleChange}
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Caste">Caste</Label>
                    <Select onValueChange={(value) => handleSelectChange('Caste', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select caste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Income">Annual Income</Label>
                    <Input
                      id="Income"
                      name="Income"
                      type="number"
                      value={formData.Income}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Gender">Gender</Label>
                    <Select onValueChange={(value) => handleSelectChange('Gender', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="State">State</Label>
                    <Input
                      id="State"
                      name="State"
                      value={formData.State}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="District">District</Label>
                    <Input
                      id="District"
                      name="District"
                      value={formData.District}
                      onChange={handleChange}
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">Add Scheme</Button>
              </form>
            </TabsContent>

            <TabsContent value="edit">
              <div className="text-center p-6">
                <p className="text-muted-foreground">Edit functionality coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
