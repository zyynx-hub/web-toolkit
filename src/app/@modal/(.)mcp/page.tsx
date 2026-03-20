import ProjectModal from "@/components/ProjectModal"
import McpLayout from "@/app/mcp/layout"
import McpPage from "@/app/mcp/page"

export default function McpModal() {
  return (
    <ProjectModal>
      <McpLayout>
        <McpPage />
      </McpLayout>
    </ProjectModal>
  )
}
