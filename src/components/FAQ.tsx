
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Download, FileIcon, FolderIcon, Github, Code } from 'lucide-react';

export function FAQ() {
  const faqItems = [
    {
      id: 'faq-1',
      question: 'Can I download a complete GitHub repository?',
      answer: 'Yes, you can download any public GitHub repository as a ZIP file. Simply enter the repository URL in the search box and click the download button.',
      icon: <Github className="h-5 w-5 text-accent" />
    },
    {
      id: 'faq-2',
      question: 'Is it possible to download a specific folder from a repository?',
      answer: 'Absolutely! RepoGrabber allows you to navigate through repositories and download specific folders. After searching for a repository, you can browse its contents and download any folder you need.',
      icon: <FolderIcon className="h-5 w-5 text-accent" />
    },
    {
      id: 'faq-3',
      question: 'Can I download individual files?',
      answer: 'Yes, you can download individual files from any public GitHub repository. Navigate to the file you want and use the download button to save it to your device.',
      icon: <FileIcon className="h-5 w-5 text-accent" />
    },
    {
      id: 'faq-4',
      question: 'Do I need a GitHub account to use RepoGrabber?',
      answer: 'No, RepoGrabber works without requiring you to have a GitHub account or to be logged in. You can freely download public repositories, folders, and files anonymously.',
      icon: <Download className="h-5 w-5 text-accent" />
    },
    {
      id: 'faq-5',
      question: 'Are there any rate limits when using RepoGrabber?',
      answer: 'RepoGrabber uses the GitHub API which has rate limits for anonymous users. If you encounter any limitations, try again later or consider signing in with your GitHub account for higher limits.',
      icon: <Code className="h-5 w-5 text-accent" />
    },
    {
      id: 'faq-6',
      question: 'Does RepoGrabber work with private repositories?',
      answer: 'RepoGrabber can only access public repositories. Private repositories require authentication and specific permissions that are not currently supported by this tool.',
      icon: <Github className="h-5 w-5 text-accent" />
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border border-border/30 rounded-lg mb-3 px-4 bg-card/50 hover:bg-card transition-colors">
          <AccordionTrigger className="flex items-center py-4 text-left">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.question}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pl-8">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
