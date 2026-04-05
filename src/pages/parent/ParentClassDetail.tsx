import { useParams } from "react-router-dom";
import ClassDetailView from "@/components/shared/ClassDetailView";
const ParentClassDetail = () => {
  const { id } = useParams();
  return <ClassDetailView classId={id!} readonly={true} rolePrefix="/parent" />;
};
export default ParentClassDetail;
