"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchIcon from "@/components/icons/SearchIcon";
import { electionsData } from "@/config/electionsData";

export default function ElectionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Simulate API call - replace this with actual API call in the future
  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // TODO: Replace with actual API call
        // const response = await fetch('/api/elections');
        // const data = await response.json();
        // setElections(data);

        setElections(electionsData);
      } catch (err) {
        setError("Failed to fetch elections. Please try again later.");
        console.error("Error fetching elections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  // Memoized filtered elections for better performance
  const filteredElections = useMemo(() => {
    let filtered = elections;

    // Filter by tab selection
    if (activeTab !== "all") {
      filtered = elections.filter(election => election.status === activeTab);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (election) =>
          election.title.toLowerCase().includes(term) ||
          election.description.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [elections, searchTerm, activeTab]);

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get election counts for each tab
  const getElectionCounts = () => {
    return {
      all: elections.length,
      ongoing: elections.filter(e => e.status === "ongoing").length,
      upcoming: elections.filter(e => e.status === "upcoming").length,
      completed: elections.filter(e => e.status === "completed").length,
    };
  };

  const counts = getElectionCounts();

  // Tab configuration
  const tabs = [
    { id: "all", label: "All Elections", count: counts.all },
    { id: "ongoing", label: "Active", count: counts.ongoing },
    { id: "upcoming", label: "Upcoming", count: counts.upcoming },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="layout-content-container flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold tracking-tighter">
              Elections Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Participate in democracy by exploring and voting in elections.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-2/3 lg:w-1/2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder={`Search ${activeTab === "all" ? "all" : activeTab} elections...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-full border-0 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              aria-label="Search elections"
            />
          </div>
          <div className="flex gap-2">
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="whitespace-nowrap"
              >
                Clear Search
              </Button>
            )}
            <div className="text-sm text-gray-500 flex items-center">
              {filteredElections.length} result{filteredElections.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredElections.map((election) => (
            <Card
              key={election.id}
              className="group flex flex-col rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      {election.title}
                    </h3>
                    <div className="flex-shrink-0">
                      {election.status === "ongoing" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Live
                        </span>
                      )}
                      {election.status === "upcoming" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Upcoming
                        </span>
                      )}
                      {election.status === "completed" && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                          Ended
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(election.startDate)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDate(election.endDate)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {election.description}
                  </p>
                </div>

                <div className="mt-auto flex gap-3">
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Link href={`/election-details/${election.id}`}>
                      View Details
                    </Link>
                  </Button>
                  
                  {election.status === "ongoing" && (
                    <Button
                      asChild
                      className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      <Link href={`/election-details/${election.id}`}>
                        Vote Now
                      </Link>
                    </Button>
                  )}
                  
                  {election.status === "upcoming" && (
                    <Button
                      disabled
                      className="flex-1 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                      Coming Soon
                    </Button>
                  )}
                  
                  {election.status === "completed" && (
                    <Button
                      asChild
                      variant="secondary"
                      className="flex-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Link href={`/election-details/${election.id}`}>
                        View Results
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredElections.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 mb-6 text-gray-300">
              <SearchIcon className="w-full h-full" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching elections found" : `No ${activeTab === "all" ? "" : activeTab} elections available`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? `No elections match your search "${searchTerm}" in the ${activeTab === "all" ? "current" : activeTab} category.`
                : activeTab === "all"
                ? "No elections are currently available. Check back later for new elections."
                : `No ${activeTab} elections at the moment. Try checking other categories.`}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
              {activeTab !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("all")}
                >
                  View All Elections
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats Cards */}
        {elections.length > 0 && activeTab === "all" && !searchTerm && (
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-700">
                      {counts.ongoing}
                    </p>
                    <p className="text-sm font-medium text-green-600">Active Elections</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-700">
                      {counts.upcoming}
                    </p>
                    <p className="text-sm font-medium text-blue-600">Upcoming Elections</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-700">
                      {counts.completed}
                    </p>
                    <p className="text-sm font-medium text-gray-600">Completed Elections</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
