"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, User, GraduationCap, MapPin, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chatbot from "@/components/chatbot";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rvisbxmyjeawkexzbjzz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient("https://rvisbxmyjeawkexzbjzz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aXNieG15amVhd2tleHpianp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MzE5ODMsImV4cCI6MjA1NjIwNzk4M30.eEjvbeZbLJ0Zhawf_rku7yqXwgznpGx1llSAmoGwuBM");

const tamilNaduDistricts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

const casteCategories = [
  "BC",
  "MBC",
  "SC",
  "ST",
  "OBC",
  "FC",
  "DNC",  // Add DNC to caste categories
];

const religionCategories = [
  "Hindu",
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Jain",
  "Others",
];

const educationLevels = [
  "Diploma/ITI",
  "Undergraduate (UG)",
  "Postgraduate (PG)",
  "Others"
];

const employmentStatus = [
  "Government Organization",
  "Private Organization",
  "Self Employed",
  "Not Applicable"
];

const indianStates = [
  "Tamil Nadu",
];

const graduationYears = Array.from(
  { length: new Date().getFullYear() - 1980 + 1 },
  (_, i) => (1980 + i).toString()
).reverse();

const occupationsList = [
  "Government Employee",
  "Private Sector Employee",
  "Business Owner",
  "Farmer",
  "Daily Wage Worker",
  "Teacher",
  "Doctor",
  "Engineer",
  "Self Employed",
  "Retired",
  "Homemaker",
  "Not Employed",
  "Others"
];

interface SchemeType {
  id: number;
  Scheme_Name: string;
  Description: string;
  Benefits: string;
  Eligibility_Criteria: string;
  Documents_Required: string;
  Application_Process: string;
  Caste: string;
  Income: number;
  Gender: string;
  State: string;
  District: string;
}

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: undefined,
    gender: "",
    caste: "",
    religion: "",
    mobileNumber: "",
    education: "",
    instituteName: "",
    boardUniversity: "",
    percentage: "",
    yearOfPassing: "",
    employmentStatus: "",
    district: "",
    place: "",
    educationState: "",
    educationDistrict: "",
    fatherOccupation: "",
    motherOccupation: "",
    familyIncome: "",
  });

  const [eligibilityForm, setEligibilityForm] = useState({
    caste: "",
    income: "",
    gender: "",
    state: "Tamil Nadu",
    district: "",
  });
  const [eligibleSchemes, setEligibleSchemes] = useState<SchemeType[]>([]);
  const [schemes, setSchemes] = useState<SchemeType[]>([]);

  useEffect(() => {
    // Commenting out the login-related logic
    /*
    const checkAuth = async () => {
      const isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"));
      if (!isLoggedIn) {
        router.push("/");
      } else {
        setUserName("User");
      }
    };
    checkAuth();
    */
  }, [router]);

  useEffect(() => {
    const fetchSchemes = async () => {
      const { data, error } = await supabase
        .from('Schemes')
        .select('*');
      
      if (error) {
        console.error('Error fetching schemes:', error);
        return;
      }
      
      if (data) {
        console.log('Fetched schemes:', data);
        setSchemes(data);
      }
    };

    fetchSchemes();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEligibilityInputChange = (field: string, value: any) => {
    setEligibilityForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with values:", formData);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      dateOfBirth: undefined,
      gender: "",
      caste: "",
      religion: "",
      mobileNumber: "",
      education: "",
      instituteName: "",
      boardUniversity: "",
      percentage: "",
      yearOfPassing: "",
      employmentStatus: "",
      district: "",
      place: "",
      educationState: "",
      educationDistrict: "",
      fatherOccupation: "",
      motherOccupation: "",
      familyIncome: "",
    });
  };

  const checkEligibility = () => {
    const filteredSchemes = schemes.filter((scheme) => {
      const isCasteEligible = scheme.Caste.toLowerCase() === eligibilityForm.caste.toLowerCase();
      const isIncomeEligible = parseInt(eligibilityForm.income) <= scheme.Income;
      
      // Handle special cases for gender
      const isGenderEligible = !scheme.Gender || 
        scheme.Gender.toLowerCase() === 'any' || 
        scheme.Gender.toLowerCase() === 'both' ||
        scheme.Gender.toLowerCase() === eligibilityForm.gender.toLowerCase();
      
      // Handle special cases for district
      const isDistrictEligible = !scheme.District || 
        scheme.District.toLowerCase() === 'for all tn districts' ||
        scheme.District.toLowerCase() === eligibilityForm.district.toLowerCase();
      
      const isStateEligible = !scheme.State || 
        scheme.State.toLowerCase() === eligibilityForm.state.toLowerCase();
      
      return isCasteEligible && isIncomeEligible && isGenderEligible && 
             isStateEligible && isDistrictEligible;
    });
    setEligibleSchemes(filteredSchemes);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h2 className="font-semibold text-lg">Welfare Navigator</h2>
          <Button variant="outline" onClick={() => router.push("/")}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Tabs defaultValue="update" className="space-y-6">
          <TabsList>
            <TabsTrigger value="update">Chat</TabsTrigger>
            <TabsTrigger value="eligibility">Scheme Eligibility</TabsTrigger>
          </TabsList>

          <TabsContent value="update">
            <div className="p-4">
              <Chatbot />
            </div>
          </TabsContent>

          <TabsContent value="eligibility">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-center text-gray-800">Check Scheme Eligibility</h1>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Community</label>
                  <Select
                    onValueChange={(value) => handleEligibilityInputChange("caste", value)}
                    value={eligibilityForm.caste}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {casteCategories.map((caste) => (
                        <SelectItem key={caste} value={caste}>
                          {caste}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <Select
                    onValueChange={(value) => handleEligibilityInputChange("gender", value)}
                    value={eligibilityForm.gender}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Male", "Female", "Other"].map((gender) => (
                        <SelectItem key={gender} value={gender.toLowerCase()}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <Select
                    onValueChange={(value) => handleEligibilityInputChange("district", value)}
                    value={eligibilityForm.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {tamilNaduDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Family Income</label>
                  <Input
                    value={eligibilityForm.income}
                    onChange={(e) => handleEligibilityInputChange("income", e.target.value)}
                    placeholder="Enter your family income"
                    type="number"
                  />
                </div>
                <Button type="button" onClick={checkEligibility} className="w-full">
                  Check Eligibility
                </Button>
              </form>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Eligible Schemes</h2>
                {eligibleSchemes.length > 0 ? (
                  eligibleSchemes.map((scheme) => (
                    <Card key={scheme.id} className="shadow-lg">
                      <CardHeader>
                        <CardTitle>{scheme.Scheme_Name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Description</h3>
                          {scheme.Description.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Benefits</h3>
                          {scheme.Benefits.split(',').map((benefit, i) => (
                            <p key={i}>• {benefit.trim()}</p>
                          ))}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
                          {scheme.Eligibility_Criteria.split('\n').map((criteria, i) => (
                            <p key={i}>{criteria}</p>
                          ))}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Documents Required</h3>
                          {scheme.Documents_Required.split('\n').map((doc, i) => (
                            <p key={i}>{doc}</p>
                          ))}
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Application Process</h3>
                          {scheme.Application_Process.split('\n').map((step, i) => (
                            <p key={i}>{step}</p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-600">No schemes found matching your criteria.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}