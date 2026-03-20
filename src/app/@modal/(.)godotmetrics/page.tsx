import ProjectModal from "@/components/ProjectModal"
import GodotMetricsLayout from "@/app/godotmetrics/layout"
import GodotMetricsPage from "@/app/godotmetrics/page"

export default function GodotMetricsModal() {
  return (
    <ProjectModal>
      <GodotMetricsLayout>
        <GodotMetricsPage />
      </GodotMetricsLayout>
    </ProjectModal>
  )
}
