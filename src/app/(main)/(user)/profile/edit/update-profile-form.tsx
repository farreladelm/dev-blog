"use client"

import { updateProfile } from "@/actions/profile";
import { User } from "@/app/generated/prisma/client";
import ProfileAvatar from "@/components/shared/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_CHAR_LENGTH = 200;

export default function UpdateProfileForm({ user }: { user: User }) {
    const [formKey, setFormKey] = useState(0);

    return <UpdateProfileFormInner key={formKey} user={user} onCancel={() => setFormKey((k) => k + 1)} />
}

function UpdateProfileFormInner({ user, onCancel }: { user: User; onCancel: () => void }) {
    const updateProfileWithUsernameAction = updateProfile.bind(null, user.username);
    const [data, action, isPending] = useActionState(updateProfileWithUsernameAction, undefined);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Character count states
    const [bioCount, setBioCount] = useState(user.bio?.length || 0);
    const [skillsCount, setSkillsCount] = useState(user.skillsOrLanguages?.length || 0);
    const [availableCount, setAvailableCount] = useState(user.availableFor?.length || 0);

    useEffect(() => {
        if (!data) return;

        if (data.success) {
            toast.success(data.data.message);
        } else {
            toast.error(data.error || "Failed to update profile");
        }
    }, [data]);

    const fieldErrors = data?.success === false ? data.fieldErrors : undefined;

    const formValues = data?.success === false && data.submittedData ? data.submittedData : user;

    const handleCancel = () => {
        toast.info("Changes reverted back to original profile details");
        onCancel();
    };

    const validateImageFile = (file: File | null): boolean => {
        setImageError(null);

        if (!file) {
            return true; // No file selected is valid (optional field)
        }

        // Check if file is an image
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            setImageError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return false;
        }

        // Check file size (5MB = 5 * 1024 * 1024 bytes)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setImageError("Image size must be less than 5MB");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return false;
        }

        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        validateImageFile(file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const file = formData.get('avatarImage') as File;

        if (file && file.size > 0) {
            if (!validateImageFile(file)) {
                e.preventDefault();
                toast.error("Please fix the image upload errors before submitting");
                return;
            }
        }
    };

    return (
        <form className="flex flex-col w-full max-w-2xl gap-4 mx-auto px-4 lg:px-0" action={action} onSubmit={handleSubmit}>
            <Link href={`/${user.username}`} className="text-3xl text-red-300 font-bold">@{user.username}</Link>
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>This information will be displayed on your public profile and article posts</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field data-invalid={!!fieldErrors?.name}>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={formValues.name ?? ""}
                                placeholder="Your full name"
                                aria-invalid={!!fieldErrors?.name}
                            />
                            {!!fieldErrors?.name && <FieldError>{fieldErrors.name}</FieldError>}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.email}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                type="text"
                                id="email"
                                name="email"
                                defaultValue={formValues.email ?? ""}
                                placeholder="you@example.com"
                                aria-invalid={!!fieldErrors?.email}
                            />
                            {!!fieldErrors?.email && (
                                <FieldError>{fieldErrors.email}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.username}>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                defaultValue={formValues.username ?? ""}
                                placeholder="username (used in your profile URL)"
                                aria-invalid={!!fieldErrors?.username}
                            />
                            {!!fieldErrors?.username && (
                                <FieldError>{fieldErrors.username}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.avatarImage || !!imageError}>
                            <FieldLabel htmlFor="avatarImage">Profile Image</FieldLabel>
                            <FieldDescription>Upload an image (JPEG, PNG, GIF, or WebP) under 5MB</FieldDescription>
                            <div className="flex gap-4 items-center">
                                <ProfileAvatar username={formValues.username} imageUrl={formValues.avatarImage} />
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    id="avatarImage"
                                    name="avatarImage"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleFileChange}
                                    aria-invalid={!!fieldErrors?.avatarImage || !!imageError}
                                />
                            </div>
                            {imageError && (
                                <FieldError>{imageError}</FieldError>
                            )}
                            {!!fieldErrors?.avatarImage && (
                                <FieldError>{fieldErrors.avatarImage}</FieldError>
                            )}
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Other Details</CardTitle>
                    <CardDescription>Optional information to help others discover you and understand your background.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field data-invalid={!!fieldErrors?.websiteUrl}>
                            <FieldLabel htmlFor="websiteUrl">Website Url</FieldLabel>
                            <Input
                                type="text"
                                id="websiteUrl"
                                name="websiteUrl"
                                defaultValue={formValues.websiteUrl ?? ""}
                                placeholder="https://yourwebsite.com"
                                aria-invalid={!!fieldErrors?.websiteUrl}
                            />
                            {!!fieldErrors?.websiteUrl && (
                                <FieldError>{fieldErrors.websiteUrl}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.githubUrl}>
                            <FieldLabel htmlFor="githubUrl">GitHub Url</FieldLabel>
                            <Input
                                type="text"
                                id="githubUrl"
                                name="githubUrl"
                                defaultValue={formValues.githubUrl ?? ""}
                                placeholder="https://github.com/username"
                                aria-invalid={!!fieldErrors?.githubUrl}
                            />
                            {!!fieldErrors?.githubUrl && (
                                <FieldError>{fieldErrors.githubUrl}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.location}>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                defaultValue={formValues.location ?? ""}
                                placeholder="City, Country"
                                aria-invalid={!!fieldErrors?.location}
                            />
                            {!!fieldErrors?.location && (
                                <FieldError>{fieldErrors.location}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.bio}>
                            <FieldLabel htmlFor="bio">Bio</FieldLabel>

                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={formValues.bio ?? ""}
                                placeholder="A short bio about what you do or write about"
                                aria-invalid={!!fieldErrors?.bio}
                                maxLength={MAX_CHAR_LENGTH}
                                onChange={(e) => setBioCount(e.target.value.length)}
                            />
                            {!!fieldErrors?.bio && (
                                <FieldError>{fieldErrors.bio}</FieldError>
                            )}
                            <FieldDescription className={`text-sm text-right ${bioCount >= MAX_CHAR_LENGTH ? 'text-amber-500 font-semibold' : 'text-muted-foreground'}`}>
                                {bioCount}/{MAX_CHAR_LENGTH}
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Coding and Work</CardTitle>
                    <CardDescription>Share your professional background, technical strengths, and how others can collaborate with you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field data-invalid={!!fieldErrors?.jobTitle}>
                            <FieldLabel htmlFor="jobTitle">Work</FieldLabel>
                            <Input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                defaultValue={formValues.jobTitle ?? ""}
                                placeholder="Company, role, or current focus"
                                aria-invalid={!!fieldErrors?.jobTitle}
                            />
                            {!!fieldErrors?.jobTitle && (
                                <FieldError>{fieldErrors.jobTitle}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.education}>
                            <FieldLabel htmlFor="education">Education</FieldLabel>
                            <Input
                                type="text"
                                id="education"
                                name="education"
                                defaultValue={formValues.education ?? ""}
                                placeholder="Degree, institution, or training"
                                aria-invalid={!!fieldErrors?.education}
                            />
                            {!!fieldErrors?.education && (
                                <FieldError>{fieldErrors.education}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.skillsOrLanguages}>
                            <FieldLabel htmlFor="skillsOrLanguages">Skills or Languages</FieldLabel>
                            <FieldDescription>What do you enjoy working with most? List your core tools, languages, or areas of expertise.</FieldDescription>
                            <Textarea
                                id="skillsOrLanguages"
                                name="skillsOrLanguages"
                                defaultValue={formValues.skillsOrLanguages ?? ""}
                                placeholder="e.g. TypeScript, React, Go, PostgreSQL"
                                aria-invalid={!!fieldErrors?.skillsOrLanguages}
                                maxLength={MAX_CHAR_LENGTH}
                                onChange={(e) => setSkillsCount(e.target.value.length)}
                            />
                            <FieldDescription className={`text-sm text-right ${skillsCount >= MAX_CHAR_LENGTH ? 'text-amber-500 font-semibold' : 'text-muted-foreground'}`}>
                                {skillsCount}/{MAX_CHAR_LENGTH}
                            </FieldDescription>
                            {!!fieldErrors?.skillsOrLanguages && (
                                <FieldError>{fieldErrors.skillsOrLanguages}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!fieldErrors?.availableFor}>
                            <FieldLabel htmlFor="availableFor">Available for</FieldLabel>
                            <FieldDescription>Describe how people can reach out or collaborate with you, and what you're currently available for.</FieldDescription>
                            <Textarea
                                id="availableFor"
                                name="availableFor"
                                defaultValue={formValues.availableFor ?? ""}
                                placeholder="Freelance, open source, mentoring, discussions"
                                aria-invalid={!!fieldErrors?.availableFor}
                                maxLength={MAX_CHAR_LENGTH}
                                onChange={(e) => setAvailableCount(e.target.value.length)}
                            />
                            <FieldDescription className={`text-sm text-right ${availableCount >= MAX_CHAR_LENGTH ? 'text-amber-500 font-semibold' : 'text-muted-foreground'}`}>
                                {availableCount}/{MAX_CHAR_LENGTH}
                            </FieldDescription>
                            {!!fieldErrors?.availableFor && (
                                <FieldError>{fieldErrors.availableFor}</FieldError>
                            )}
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex gap-4">
                    <Button variant="outline" type="button" className="cursor-pointer" disabled={isPending} onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1 cursor-pointer" disabled={isPending}>
                        {isPending ?
                            <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Profile Details</span>
                            : "Save Profile Details"}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}