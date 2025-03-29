import AddCompanyForm from "./add-company-form";

export default function AdminAddCompanyPage() {
  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Add Company</h1>
      <AddCompanyForm />
    </div>
  );
}
