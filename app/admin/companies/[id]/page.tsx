"use client";
import React,{ useEffect, useState } from "react";
import { useParams } from 'next/navigation'; 
import UpdateCompanyForm from "./update-company-form";
import { FullCompany } from "@/lib/validators";

const AdminCompanyUpdatePage = () => {
  const params = useParams();
  const { id } = params;
  const [company, setCompany] = useState<FullCompany | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${id}`);

        if (!response.ok) {
          throw new Error("Company not found");
        }

        const companyData = await response.json();
        setCompany(companyData);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  },[id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!company) {
    return <div>No company data available.</div>; // Handle case where no data is available
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update Company</h1>
      <UpdateCompanyForm companyId={id} company={company} />
    </div>
  );
};

export default AdminCompanyUpdatePage;
