import ProjectModal from "@/components/ProjectModal"
import SPSSLayout from "@/app/spss/layout"
import SPSSPage from "@/app/spss/page"

export default function SPSSModal() {
  return (
    <ProjectModal>
      <SPSSLayout>
        <SPSSPage />
      </SPSSLayout>
    </ProjectModal>
  )
}
