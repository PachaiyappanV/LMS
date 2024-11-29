import NonDashboardNavbar from "@/components/non-dashboard-navbar";
import Landing from "./(non-dashboard)/landing/page";

export default function Home() {
  return (
    <div className=" nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
    </div>
  );
}
