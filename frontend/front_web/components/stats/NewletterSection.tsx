import { Send } from "lucide-react";
import newsletterBg from "@/assets/newsletter-bg.jpg";

const NewsletterSection = () => {
  return (
    <section className="py-16">
      <div
        className="relative rounded-2xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${newsletterBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="relative z-10 py-16 px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground mb-2">
            Sign up to our newsletter
          </h2>
          <p className="text-primary-foreground/80 text-sm mb-8">
            Receive latest news, update, and many other things every week
          </p>
          <div className="max-w-md mx-auto flex items-center bg-background rounded-full overflow-hidden shadow-lg">
            <input
              type="email"
              placeholder="Enter Your email address"
              className="flex-1 px-6 py-3 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="bg-primary text-primary-foreground p-3 rounded-full m-1 hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
