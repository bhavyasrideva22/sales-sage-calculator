
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail } from 'lucide-react';

interface SalesData {
  label: string;
  value: number;
}

interface EmailForecastProps {
  forecastData: SalesData[];
  initialSales: number;
  growthRate: number;
  timeframe: number;
  totalForecast: number;
}

export const EmailForecast: React.FC<EmailForecastProps> = ({
  forecastData,
  initialSales,
  growthRate,
  timeframe,
  totalForecast,
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(`Your Sales Forecast Report for ${timeframe} Months`);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Missing Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // In a real implementation, you would send this data to a backend service
    // that would generate and email the report. Here we'll simulate that process.
    
    // Prepare email content
    const emailContent = {
      to: email,
      subject: subject,
      message: message,
      forecastData: {
        initialSales,
        growthRate,
        timeframe,
        totalForecast,
        monthlyData: forecastData
      }
    };
    
    // Simulate API call
    try {
      // For demo purposes, we'll just log the data and simulate a success response
      console.log('Email data to be sent:', emailContent);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email Sent Successfully",
        description: `The forecast report has been sent to ${email}`,
      });
      
      setIsOpen(false);
      setMessage("");
    } catch (error) {
      toast({
        title: "Failed to Send Email",
        description: "There was a problem sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Generate default message when dialog opens
  const generateDefaultMessage = () => {
    return `Hello,

I'd like to share this sales forecast report with you.

Key highlights:
- Initial monthly sales: ${formatCurrency(initialSales)}
- Growth rate: ${growthRate}% per month
- Forecast period: ${timeframe} months
- Total projected sales: ${formatCurrency(totalForecast)}

This forecast was generated using the SaleSage Forecasting Calculator.

Regards,
[Your Name]`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center"
          onClick={() => {
            if (message === "") {
              setMessage(generateDefaultMessage());
            }
          }}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSendEmail}>
          <DialogHeader>
            <DialogTitle>Email Forecast Report</DialogTitle>
            <DialogDescription>
              Send your sales forecast report to yourself or a colleague.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="text-right pt-2">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-3"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSending} className="bg-sage-primary hover:bg-sage-primary/90">
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
