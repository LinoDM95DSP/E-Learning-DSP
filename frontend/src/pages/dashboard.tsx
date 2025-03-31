import MinimalGaugeChart from "../components/charts/chart_gauge";
import ProgressbarMinimal from "../components/charts/progressbar_minimal";

function Dashboard() {
  return (
    <div className="">
      <h1>Dashboard</h1>
      <div className="flex items-center">
        <div className="w-80">
          <ProgressbarMinimal progressValue={60} />
        </div>
        <MinimalGaugeChart progressValue={10} />
      </div>
    </div>
  );
}

export default Dashboard;
