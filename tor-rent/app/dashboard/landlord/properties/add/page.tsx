"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Plus, Upload, X, Loader2 } from "lucide-react"
import { PropertyLocationMap } from "@/components/property-location-map"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/hooks/useUser"
import { addProperty } from "@/lib/helpers/property-helper"

// Form validation schema
const propertyFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(1000),
  location: z.string().min(5, { message: "Location must be at least 5 characters" }),
  propertyType: z.enum(["apartment", "house", "villa", "office", "shop", "other"]),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  priceUnit: z.enum(["day", "week", "month"]),
  bedrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Bedrooms must be a non-negative number",
  }),
  bathrooms: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Bathrooms must be a non-negative number",
  }),
  area: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Area must be a positive number",
  }),
  areaUnit: z.enum(["sqft", "sqm"]),
  amenities: z.array(z.string()).optional(),
  furnished: z.enum(["unfurnished", "semi-furnished", "fully-furnished"]),
  availableFrom: z.string(),
  minimumLeasePeriod: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Minimum lease period must be a positive number",
  }),
  leasePeriodUnit: z.enum(["months", "years"]),
})

// Define amenities options
const amenitiesOptions = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "Air Conditioning" },
  { id: "parking", label: "Parking" },
  { id: "gym", label: "Gym" },
  { id: "pool", label: "Swimming Pool" },
  { id: "security", label: "24x7 Security" },
  { id: "elevator", label: "Elevator" },
  { id: "laundry", label: "Laundry" },
  { id: "balcony", label: "Balcony" },
  { id: "garden", label: "Garden" },
  { id: "pets", label: "Pet Friendly" },
  { id: "cctv", label: "CCTV" },
]

export default function AddPropertyPage() {
  const router = useRouter()
  const { user } = useUser()
  const userId = user?.id || 'landlord-1' // Fallback ID for development
  const [images, setImages] = useState<{ url: string; file?: File }[]>([])
  const [activeTab, setActiveTab] = useState("basicInfo")
  const [location, setLocation] = useState({ latitude: 12.9716, longitude: 77.5946 }) // Default: Bangalore
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Console log for debugging
  console.log("Rendering AddPropertyPage, userId:", userId)

  // Initialize form
  const form = useForm<z.infer<typeof propertyFormSchema>>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      propertyType: "apartment",
      price: "",
      priceUnit: "month",
      bedrooms: "",
      bathrooms: "",
      area: "",
      areaUnit: "sqft",
      amenities: [],
      furnished: "unfurnished",
      availableFrom: new Date().toISOString().split("T")[0],
      minimumLeasePeriod: "11",
      leasePeriodUnit: "months",
    },
  })

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof propertyFormSchema>) => {
    console.log("Form submission triggered!", data)
    try {
      // Set submitting state
      setIsSubmitting(true)
      
      // Additional validation for description length
      if (data.description.length < 20) {
        console.log("Description too short");
        toast({
          title: "Description Too Short",
          description: "Please ensure your property description is at least 20 characters long.",
          variant: "destructive"
        });
        setActiveTab("basicInfo");
        setIsSubmitting(false);
        return;
      }
      
      // Validate images - this is critical
      if (images.length === 0) {
        console.log("No images uploaded")
        toast({
          title: "Error",
          description: "Please upload at least one image of the property.",
          variant: "destructive"
        })
        setActiveTab("media")
        setIsSubmitting(false)
        return
      }
      
      // Log form data
    console.log("Form data:", data)
    console.log("Images:", images)
    console.log("Location:", location)

      // Create a complete property data object
      const propertyData: AddPropertyInput = {
        ...data,
        images,
        coordinates: location,
        userId: userId || 'landlord-1' // Ensure there's always a userId
      }
      
      // Add property using our helper
      console.log("Submitting property data:", propertyData)
      
      // Show a temporary toast during submission
      toast({
        title: "Adding Property",
        description: "Your property is being added...",
      })
      
      // Call the property helper
      const result = await addProperty(propertyData)
      console.log("Property added successfully:", result)
      
      // Show success toast
      toast({
        title: "Property Added Successfully",
        description: result.blockchainId 
          ? `Property added with ID: ${result.id} and blockchain ID: ${result.blockchainId}` 
          : `Property added with ID: ${result.id}`,
        variant: "default",
      })
      
      // Show a more visible alert
      alert(`Property "${data.title}" has been successfully listed!\nProperty ID: ${result.id}${result.blockchainId ? `\nBlockchain ID: ${result.blockchainId}` : ''}`)
      
      // Redirect to properties page after a short delay to allow the user to see the success message
    setTimeout(() => {
      router.push("/dashboard/landlord/properties?success=true")
      }, 1000)
      
    } catch (error) {
      console.error("Error adding property:", error)
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to add property: ${error.message}` 
          : "Failed to add property. Please try again.",
        variant: "destructive"
      })
      
      // Reset submitting state
      setIsSubmitting(false)
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered");
    
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No files selected");
      return;
    }

    // Get selected files
    const files = Array.from(e.target.files);
    console.log("Files selected:", files.length);
    
    // Process each file
    const newImages = files.map(file => {
      // Create a URL for the image
      const url = URL.createObjectURL(file);
      console.log("Created URL for image:", url);
      return { url, file };
    });
    
    // Add new images to existing images
    setImages(prev => [...prev, ...newImages]);
    
    // Show success toast if images uploaded
    if (newImages.length > 0) {
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${newImages.length} image${newImages.length > 1 ? 's' : ''}.`,
      });
    }
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add New Property</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="basicInfo">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details & Amenities</TabsTrigger>
          <TabsTrigger value="media">Media & Location</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={(e) => {
            console.log("Raw form submit event triggered");
            form.handleSubmit(onSubmit)(e);
          }} className="space-y-8">
            <TabsContent value="basicInfo" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Luxury 3BHK Apartment in HSR Layout" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear title helps tenants find your property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="office">Office Space</SelectItem>
                          <SelectItem value="shop">Shop/Retail</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address/Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. HSR Layout, Bangalore" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rent Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rent period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="day">Per Day</SelectItem>
                          <SelectItem value="week">Per Week</SelectItem>
                          <SelectItem value="month">Per Month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Example: This well-maintained apartment features a spacious living room with excellent natural lighting. Located close to shopping and public transport. Perfect for professionals or small families."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include key features, nearby amenities, and other selling points.
                        <span className="text-gray-500 ml-2">
                          {field.value.length}/20 characters (minimum)
                        </span>
                      </FormDescription>
                      <div className="mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            form.setValue("description", "This is a spacious apartment with modern amenities located in a prime area. Close to restaurants, shopping centers, and public transportation.");
                          }}
                        >
                          Use Sample Description
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <div />
                <Button 
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Next: Details & Amenities
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="number" placeholder="e.g. 1200" {...field} className="flex-1" />
                        </FormControl>
                        <Select
                          onValueChange={(value) => form.setValue("areaUnit", value as "sqft" | "sqm")}
                          defaultValue={form.getValues("areaUnit")}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sqft">sq.ft</SelectItem>
                            <SelectItem value="sqm">sq.m</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="furnished"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>Furnishing Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="unfurnished" />
                            </FormControl>
                            <FormLabel className="font-normal">Unfurnished</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="semi-furnished" />
                            </FormControl>
                            <FormLabel className="font-normal">Semi-furnished</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="fully-furnished" />
                            </FormControl>
                            <FormLabel className="font-normal">Fully furnished</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available From</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="minimumLeasePeriod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Minimum Lease Period</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leasePeriodUnit"
                    render={({ field }) => (
                      <FormItem className="w-32 self-end">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem className="md:col-span-3 mt-4">
                      <FormLabel>Amenities</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {amenitiesOptions.map((option) => (
                          <FormField
                            key={option.id}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.id}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.id) || false}
                                      onCheckedChange={(checked) => {
                                        const currentValue = field.value || []
                                        if (checked) {
                                          form.setValue("amenities", [...currentValue, option.id])
                                        } else {
                                          form.setValue(
                                            "amenities",
                                            currentValue.filter((value) => value !== option.id)
                                          )
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">{option.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basicInfo")}>
                  Back
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("media")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Next: Media & Location
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Property Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <img
                          src={image.url}
                          alt={`Property ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {images.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">Please upload at least one image of your property.</p>
                  )}
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Property Location</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Set the exact location of your property on the map by dragging the marker.
                  </p>
                  <div className="h-[400px] rounded-md overflow-hidden border">
                    <PropertyLocationMap 
                      initialLocation={location} 
                      onLocationChange={setLocation} 
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex gap-4">
                    <span>Latitude: {location.latitude.toFixed(6)}</span>
                    <span>Longitude: {location.longitude.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Back
                </Button>
                <Button 
                  type="button"
                  className="bg-green-600 hover:bg-green-700 px-8"
                  disabled={isSubmitting}
                  onClick={() => {
                    console.log("SUBMIT button clicked manually, form state:", form.formState);
                    // First check if the form is valid
                    form.trigger().then(isValid => {
                      console.log("Form validation result:", isValid);
                      if (isValid) {
                        // If valid, manually submit the form
                        form.handleSubmit(onSubmit)();
                      } else {
                        // Show validation errors and navigate to proper tab
                        const errors = form.formState.errors;
                        console.log("Form validation errors:", errors);
                        
                        // Check for description error specifically, since that's a common issue
                        if (errors.description) {
                          setActiveTab("basicInfo");
                          toast({
                            title: "Description Too Short",
                            description: "Please ensure your property description is at least 20 characters long.",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // Determine which tab to show based on errors
                        if (errors.title || errors.propertyType || errors.location || errors.price || errors.priceUnit) {
                          setActiveTab("basicInfo");
                          toast({
                            title: "Validation Error",
                            description: "Please fill in all required fields in the Basic Info section",
                            variant: "destructive"
                          });
                        } else if (errors.bedrooms || errors.bathrooms || errors.area || errors.areaUnit || 
                            errors.furnished || errors.availableFrom || errors.minimumLeasePeriod || errors.leasePeriodUnit) {
                          setActiveTab("details");
                          toast({
                            title: "Validation Error",
                            description: "Please fill in all required fields in the Details section",
                            variant: "destructive"
                          });
                        } else {
                          // No images check
                          if (images.length === 0) {
                            toast({
                              title: "Validation Error",
                              description: "Please upload at least one image of the property",
                              variant: "destructive"
                            });
                          } else {
                            // If no specific errors detected but form is invalid
                            toast({
                              title: "Validation Error",
                              description: "Please fill in all required fields",
                              variant: "destructive"
                            });
                          }
                        }
                      }
                    });
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Property...
                    </>
                  ) : (
                    "Publish Property"
                  )}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
} 