'use client';

import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ScrollStack,{ScrollStackItem} from '@/components/scroll/ScrollStack';
import { cn } from '@/lib/utils';
// sample data
import { testimonials, Testimonial } from '@/lib/testimonials';

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative h-full flex flex-col">
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <Quote className="w-4 h-4 text-white" />
      </div>
      
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
        "{testimonial.content}"
      </p>
      
      {/* Avatar and Info */}
      <div className="flex items-center gap-3 mt-auto">
        <div className={cn(
          "w-10 h-10 rounded-full bg-gradient-to-r flex items-center justify-center",
          testimonial.avatarColor
        )}>
          <span className="text-white text-sm font-semibold">
            {testimonial.avatarInitials}
          </span>
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{testimonial.name}</p>
          <p className="text-xs text-gray-400">{testimonial.role} • {testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-5 relative overflow-hidden ">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge 
            variant="outline" 
            className="mb-4 px-4 py-1 text-purple-400 border-purple-500/50 bg-purple-500/10 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            Real Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            What Our Users Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of happy tenants and landlords who found their perfect match on UrbanKey
          </p>
        </motion.div>

        {/* Scroll Stack Testimonials */}
        <div className="relative min-h-[700px]">
          <ScrollStack
            itemDistance={80}
            itemScale={0.05}
            itemStackDistance={25}
            stackPosition="30%"
            scaleEndPosition="20%"
            baseScale={0.85}
            rotationAmount={0}
            blurAmount={0}
            useWindowScroll={true}
          >
            {testimonials.map((testimonial) => (
              <ScrollStackItem key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>


        {/* Stats Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-gray-900"
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">
              Trusted by <span className="font-semibold text-white">5,000+</span> happy users
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}