import ProjectModal from "@/components/ProjectModal"
import FileStudioLayout from "@/app/filestudio/layout"
import FileStudioPage from "@/app/filestudio/page"

export default function FileStudioModal() {
  return (
    <ProjectModal>
      <FileStudioLayout>
        <FileStudioPage />
      </FileStudioLayout>
    </ProjectModal>
  )
}
