import ProjectModal from "@/components/ProjectModal"
import BackroomsLayout from "@/app/backrooms/layout"
import BackroomsPage from "@/app/backrooms/page"

export default function BackroomsModal() {
  return (
    <ProjectModal>
      <BackroomsLayout>
        <BackroomsPage />
      </BackroomsLayout>
    </ProjectModal>
  )
}
