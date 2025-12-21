
// 'use client';

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import { Camera, CheckCircle, Droplets, Eye, EyeOff, Heart, Mail, MapPin, Pencil, Phone, Upload, User } from "lucide-react";
// import Image from "next/image";
// import React, { useState } from "react";

// export default function ProfilePage() {
//     const [profileData, setProfileData] = useState({
//         name: "Chinta Lokesh Babu",
//         patientId: "PAT001",
//         age: "27",
//         gender: "Male",
//         bloodGroup: "O+",
//         email: "lokeshbabu9298@gmail.com",
//         phone: "+91 8008334948",
//         address: "Rentala village, Rentachintala mandal, Palnadu district, Andhra Pradesh, India",
//         aadhar: "123456789012"
//     });

//     const [formData, setFormData] = useState(profileData);
//     const [profilePic, setProfilePic] = useState<File | null>(null);
//     const [aadharPic, setAadharPic] = useState<File | null>(() => {
//         // Mock a pre-existing file for display purposes
//         try {
//             return new File([""], "aadhar-mock.jpg", { type: "image/jpeg" });
//         } catch (e) {
//             return null; // For SSR or environments where File constructor isn't available
//         }
//     });
//     const [showAadharNumber, setShowAadharNumber] = useState(false);
//     const [showAadharPhoto, setShowAadharPhoto] = useState(false);


//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { id, value } = e.target;
//         setFormData(prev => ({ ...prev, [id]: value }));
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profile' | 'aadhar') => {
//         if (e.target.files && e.target.files[0]) {
//             if (fileType === 'profile') {
//                 setProfilePic(e.target.files[0]);
//             } else {
//                 setAadharPic(e.target.files[0]);
//             }
//         }
//     };

//     const handleSave = () => {
//         setProfileData(formData);
//         // Here you would typically handle the file uploads
//     };

//     return (
//         <div className="space-y-6">
//             <Card className="relative border-2 border-foreground shadow-md">
//                  <Dialog>
//                     <DialogTrigger asChild>
//                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full bg-muted/70 flex-shrink-0">
//                             <Pencil className="h-4 w-4" style={{color: 'hsl(var(--nav-profile))'}} />
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                         <DialogHeader>
//                             <DialogTitle>Edit Profile</DialogTitle>
//                             <DialogDescription>
//                                 Make changes to your profile here. Click save when you're done.
//                             </DialogDescription>
//                         </DialogHeader>
//                         <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
//                              <div className="flex justify-center">
//                                 <div className="relative">
//                                     <Avatar className="h-24 w-24 border" style={{borderColor: 'hsl(var(--nav-profile))'}}>
//                                         <AvatarImage src={profilePic ? URL.createObjectURL(profilePic) : "/images/profile.jpg"} />
//                                         <AvatarFallback className="text-3xl">CL</AvatarFallback>
//                                     </Avatar>
//                                     <Button asChild variant="ghost" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-muted/80">
//                                         <label htmlFor="profile-pic-upload" className="cursor-pointer">
//                                             <Camera className="h-4 w-4" style={{color: 'hsl(var(--nav-profile))'}} />
//                                         </label>
//                                     </Button>
//                                     <input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="name">Full Name</Label>
//                                 <Input id="name" value={formData.name} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="email">Email</Label>
//                                 <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="phone">Phone</Label>
//                                 <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="address">Address</Label>
//                                 <Textarea id="address" value={formData.address} onChange={handleInputChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="aadhar">Aadhar Number</Label>
//                                 <Input id="aadhar" value={formData.aadhar} onChange={handleInputChange} placeholder="Enter 12-digit Aadhar number"/>
//                             </div>
//                              <div className="space-y-2">
//                                 <Label htmlFor="aadhar-card-photo">Aadhar Card Photo (Front)</Label>
//                                 <div className="flex items-center gap-2">
//                                     <Button asChild variant="outline" className="flex-1">
//                                         <label htmlFor="aadhar-pic-upload" className="cursor-pointer">
//                                             <Upload className="mr-2 h-4 w-4" />
//                                             {aadharPic ? aadharPic.name : 'Choose File'}
//                                         </label>
//                                     </Button>
//                                     <input id="aadhar-pic-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'aadhar')} />
//                                 </div>
//                                 {aadharPic && <p className="text-xs text-muted-foreground mt-1">Selected: {aadharPic.name}</p>}
//                             </div>
//                         </div>
//                         <DialogFooter>
//                             <DialogClose asChild>
//                                 <Button type="button" variant="secondary">Cancel</Button>
//                             </DialogClose>
//                             <DialogClose asChild>
//                                 <Button type="button" onClick={handleSave} style={{ backgroundColor: 'hsl(var(--nav-profile))' }}>Save Changes</Button>
//                             </DialogClose>
//                         </DialogFooter>
//                     </DialogContent>
//                 </Dialog>

//                 <CardContent className="p-4 sm:p-6 space-y-2">
//                     <div className="flex items-center gap-4">
//                         <Avatar className="h-16 w-16 border flex-shrink-0" style={{borderColor: 'hsl(var(--nav-profile))'}}>
//                             <AvatarImage src="/images/profile.jpg" />
//                             <AvatarFallback className="text-2xl">CL</AvatarFallback>
//                         </Avatar>
//                         <div className="space-y-1 overflow-hidden">
//                             <h1 className="text-xl font-semibold whitespace-nowrap truncate">{profileData.name}</h1>
//                             <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground font-bold">
//                                 <span>Patient ID: {profileData.patientId}</span>
//                                 <div className="flex items-center gap-1"><User className="h-3 w-3 text-muted-foreground" /> {profileData.age} years</div>
//                                 <div className="flex items-center gap-1"><Heart className="h-3 w-3 text-muted-foreground" /> {profileData.gender}</div>
//                                 <div className="flex items-center gap-1"><Droplets className="h-3 w-3 text-muted-foreground" /> {profileData.bloodGroup}</div>
//                             </div>
//                         </div>
//                     </div>

//                     <Separator className="my-2" />

//                     <div className="space-y-2">
//                         <h3 className="font-semibold text-lg flex items-center gap-2">
//                             <MapPin style={{color: 'hsl(var(--nav-profile))'}}/> Address & Contact
//                         </h3>
//                         <div className="grid grid-cols-1 gap-y-2 text-sm pt-2">
//                             <div className="flex items-center gap-3">
//                                 <Mail style={{color: 'hsl(var(--nav-profile))'}} className="h-4 w-4 flex-shrink-0"/>
//                                 <span className="text-muted-foreground">{profileData.email}</span>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <Phone style={{color: 'hsl(var(--nav-profile))'}} className="h-4 w-4 flex-shrink-0"/>
//                                 <span className="text-muted-foreground">{profileData.phone}</span>
//                             </div>
//                             <div className="flex items-start gap-3">
//                                 <MapPin style={{color: 'hsl(var(--nav-profile))'}} className="h-4 w-4 mt-1 flex-shrink-0"/>
//                                 <span className="text-muted-foreground">{profileData.address}</span>
//                             </div>
//                         </div>
//                     </div>

//                     <Separator className="my-2" />

//                     <div className="space-y-4">
//                         <h3 className="font-semibold text-lg flex items-center gap-2">
//                             <CheckCircle className="text-foreground"/> Verified
//                         </h3>
//                         <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
//                             <div className="space-y-1">
//                                 <p className="font-semibold">Aadhar Card Number</p>
//                                 <p className="text-sm text-muted-foreground tracking-wider">
//                                     {showAadharNumber ? profileData.aadhar : `**** **** ${profileData.aadhar.slice(-4)}`}
//                                 </p>
//                             </div>
//                              <Button variant="ghost" size="icon" onClick={() => setShowAadharNumber(!showAadharNumber)}>
//                                 {showAadharNumber ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                             </Button>
//                         </div>
//                          {aadharPic && (
//                              <div className="p-3 bg-muted/40 rounded-lg">
//                                 <div className="flex items-center justify-between mb-2">
//                                      <p className="font-semibold">Aadhar Card Photo</p>
//                                      <Button variant="ghost" size="icon" onClick={() => setShowAadharPhoto(!showAadharPhoto)}>
//                                         {showAadharPhoto ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                                     </Button>
//                                 </div>
//                                 {showAadharPhoto && (
//                                      <Image
//                                         src={URL.createObjectURL(aadharPic)}
//                                         alt="Aadhar Card"
//                                         width={400}
//                                         height={250}
//                                         className="rounded-md border w-full object-contain"
//                                     />
//                                 )}
//                             </div>
//                          )}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }
