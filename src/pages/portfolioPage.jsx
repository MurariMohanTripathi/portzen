import ModernTemplate from "../templates/ModernTemplate";
import MinimalTemplate from "../templates/MinimalTemplate";
import GlassTemplate from "../templates/GlassTemplate";

export default function PortfolioPage({ user }) {

   switch(user.template){

      case "minimal":
         return <MinimalTemplate user={user} />

      case "glass":
         return <GlassTemplate user={user} />

      default:
         return <ModernTemplate user={user} />
   }
}