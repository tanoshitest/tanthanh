import { useParams } from "react-router-dom";
import ClassDetailView from "@/components/shared/ClassDetailView";
const TeacherClassDetail = () => {
  const { id } = useParams();
  return <ClassDetailView classId={id!} readonly={false} rolePrefix="/teacher" />;
};
export default TeacherClassDetail;
