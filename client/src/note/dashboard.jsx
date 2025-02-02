import Container from "react-bootstrap/esm/Container";
import noteListProvider from "./note-list-provider";
import DashboardContent from "./dashboard-content";

function Dashboard() {
  return (
    <Container>
      <noteListProvider>
        <DashboardContent />
      </noteListProvider>
    </Container>
  );
}

export default Dashboard;
