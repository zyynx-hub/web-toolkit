import ProjectModal from "@/components/ProjectModal"
import BrendaLayout from "@/app/brenda/layout"
import BrendaPage from "@/app/brenda/page"

export default function BrendaModal() {
  return (
    <ProjectModal>
      <BrendaLayout>
        <BrendaPage />
      </BrendaLayout>
    </ProjectModal>
  )
}
