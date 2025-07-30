"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CandidateRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [elections, setElections] = useState([]);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",

    // Political Information
    electionId: "",
    party: "",
    slogan: "",
    manifesto: "",

    // Professional Background
    experience: "",
    education: "",
    achievements: "",

    // Campaign Information
    website: "",
    twitter: "",
    facebook: "",

    // Additional
    profileImage: null,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  // Fetch elections for dropdown
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch('/api/admin/elections');
        if (res.ok) {
          const data = await res.json();
          // Only show ongoing/upcoming elections
          setElections((data.elections || []).filter(e => e.status !== 'completed'));
        }
      } catch (err) {
        // Ignore error, just don't show elections
      }
    };
    fetchElections();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.electionId) newErrors.electionId = "Election selection is required";
    if (!formData.party) newErrors.party = "Political party is required";
    if (!formData.manifesto.trim())
      newErrors.manifesto = "Manifesto is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!formData.education.trim())
      newErrors.education = "Education is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (
      formData.phone &&
      !phoneRegex.test(formData.phone.replace(/\s+/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    // Profile image validation (required)
    if (!formData.profileImage) {
      newErrors.profileImage = "Profile image is required";
    } else {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (!allowedTypes.includes(formData.profileImage.type)) {
        newErrors.profileImage =
          "Please upload a valid image file (JPG, PNG, or GIF)";
      }

      if (formData.profileImage.size > maxSize) {
        newErrors.profileImage = "Image size must be less than 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Send all fields expected by backend
      formDataToSend.append('name', `${formData.firstName} ${formData.lastName}`);
      formDataToSend.append('organization', formData.party);
      formDataToSend.append('electionId', formData.electionId);
      if (formData.dateOfBirth) {
        formDataToSend.append('age', new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear());
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      }
      formDataToSend.append('bio', formData.manifesto);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('education', formData.education);
      formDataToSend.append('achievements', formData.achievements);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('twitter', formData.twitter);
      formDataToSend.append('facebook', formData.facebook);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('slogan', formData.slogan);
      // Add profile image (required)
      if (formData.profileImage) {
        formDataToSend.append('img', formData.profileImage);
      }

      const response = await fetch('/api/candidate', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful! Your profile is under review.");
        router.push("/elections");
      } else {
        alert(result.error || "Registration failed. Please try again.");
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Candidate Registration
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Join the democratic process by registering as a candidate
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              </div>

              {/* Profile Photo Upload */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profileImage">Profile Photo</Label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        handleInputChange("profileImage", file);
                      }}
                      className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                        errors.profileImage ? "border-red-500" : ""
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a professional headshot (JPG, PNG, or GIF - Max
                      5MB)
                    </p>
                    {errors.profileImage && (
                      <p className="text-sm text-red-500">
                        {errors.profileImage}
                      </p>
                    )}
                  </div>
                  {formData.profileImage && (
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                        <img
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Political Information */}
          <Card>
            <CardHeader>
              <CardTitle>Political Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="electionId">Election *</Label>
                <Select
                  value={formData.electionId}
                  onValueChange={(value) => handleInputChange("electionId", value)}
                  required
                >
                  <SelectTrigger className={errors.electionId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select an election" />
                  </SelectTrigger>
                  <SelectContent>
                    {elections.map((election) => (
                      <SelectItem key={election._id} value={election._id}>
                        {election.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.electionId && (
                  <p className="text-sm text-red-500">{errors.electionId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="party">Political Party *</Label>
                <Input
                  id="party"
                  placeholder="e.g., Democratic Party, Republican Party"
                  value={formData.party}
                  onChange={(e) => handleInputChange("party", e.target.value)}
                  className={errors.party ? "border-red-500" : ""}
                />
                {errors.party && (
                  <p className="text-sm text-red-500">{errors.party}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slogan">Campaign Slogan</Label>
                <Input
                  id="slogan"
                  placeholder="e.g., Progress Through Unity"
                  value={formData.slogan}
                  onChange={(e) => handleInputChange("slogan", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manifesto">Manifesto *</Label>
                <Textarea
                  id="manifesto"
                  placeholder="Describe your political vision, policies, and what you stand for..."
                  value={formData.manifesto}
                  onChange={(e) =>
                    handleInputChange("manifesto", e.target.value)
                  }
                  className={`min-h-[120px] ${
                    errors.manifesto ? "border-red-500" : ""
                  }`}
                />
                {errors.manifesto && (
                  <p className="text-sm text-red-500">{errors.manifesto}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Background */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Professional Experience *</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your relevant work experience, leadership roles, and professional background..."
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className={`min-h-[100px] ${
                    errors.experience ? "border-red-500" : ""
                  }`}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Textarea
                  id="education"
                  placeholder="List your educational qualifications, degrees, and institutions..."
                  value={formData.education}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  className={`min-h-[100px] ${
                    errors.education ? "border-red-500" : ""
                  }`}
                />
                {errors.education && (
                  <p className="text-sm text-red-500">{errors.education}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  placeholder="List your significant achievements, awards, and accomplishments (one per line)..."
                  value={formData.achievements}
                  onChange={(e) =>
                    handleInputChange("achievements", e.target.value)
                  }
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Campaign Information */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website">Campaign Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-campaign-website.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter Handle</Label>
                <Input
                  id="twitter"
                  placeholder="@yourusername"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="facebook">Facebook Page</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/your-campaign-page"
                  value={formData.facebook}
                  onChange={(e) =>
                    handleInputChange("facebook", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <input
              id="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <Label htmlFor="termsAccepted" className="mb-0">
              I accept the terms and conditions *
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-sm text-red-500">{errors.termsAccepted}</p>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? "Registering..." : "Register as Candidate"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
