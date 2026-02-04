"use client"

import { updateProfile } from "@/actions/profile";
import { User } from "@/app/generated/prisma/client";
import ProfileAvatar from "@/components/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function UpdateProfileForm({ user }: { user: User }) {
    const updateProfileWithUsernameAction = updateProfile.bind(null, user.username);
    const [data, action, isPending] = useActionState(updateProfileWithUsernameAction, undefined);

    useEffect(() => {
        if (!data) return;

        if (data.success) {
            toast.success(data.data.message);
        }
    }, [data]);

    const isError = !data?.success;

    return (
        <form className="flex flex-col w-full max-w-2xl gap-4 mx-auto" action={action}>
            <h1 className="text-3xl text-red-300 font-bold">@{user.username}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>User Details</CardTitle>
                    <CardDescription>This information will be displayed on your public profile and article posts</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                defaultValue={user.name ?? ""}
                                placeholder="Your full name"
                            />
                        </Field>
                        <Field data-invalid={isError && data?.fieldErrors?.email ? true : false}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                type="text"
                                id="email"
                                name="email"
                                defaultValue={user.email ?? ""}
                                placeholder="you@example.com"
                                aria-invalid={isError && data?.fieldErrors?.email ? true : false}
                            />
                            {isError && data?.fieldErrors?.email && (
                                <FieldDescription className="text-red-400">{data.fieldErrors.email}</FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                defaultValue={user.username ?? ""}
                                placeholder="username (used in your profile URL)"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="avatarImage">Profile Image</FieldLabel>
                            <div className="flex gap-4 items-center">
                                <ProfileAvatar username={user.username} imageUrl={user.avatarImage} />
                                <Input
                                    type="file"
                                    id="avatarImage"
                                    name="avatarImage"
                                    placeholder="Your avatar image"
                                />
                            </div>
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
                        <Field>
                            <FieldLabel htmlFor="websiteUrl">Website Url</FieldLabel>
                            <Input
                                type="text"
                                id="websiteUrl"
                                name="websiteUrl"
                                defaultValue={user.websiteUrl ?? ""}
                                placeholder="https://yourwebsite.com"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="location">Location</FieldLabel>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                defaultValue={user.location ?? ""}
                                placeholder="City, Country"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="bio">Bio</FieldLabel>
                            <Textarea
                                id="bio"
                                name="bio"
                                defaultValue={user.bio ?? ""}
                                placeholder="A short bio about what you do or write about"
                            />
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
                        <Field>
                            <FieldLabel htmlFor="jobTitle">Work</FieldLabel>
                            <Input
                                type="text"
                                id="jobTitle"
                                name="jobTitle"
                                defaultValue={user.jobTitle ?? ""}
                                placeholder="Company, role, or current focus"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="education">Education</FieldLabel>
                            <Input
                                type="text"
                                id="education"
                                name="education"
                                defaultValue={user.education ?? ""}
                                placeholder="Degree, institution, or training"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="skillsOrLanguages">Skills or Languages</FieldLabel>
                            <FieldDescription>What do you enjoy working with most? List your core tools, languages, or areas of expertise.</FieldDescription>
                            <Textarea
                                id="skillsOrLanguages"
                                name="skillsOrLanguages"
                                defaultValue={user.skillsOrLanguages ?? ""}
                                placeholder="e.g. TypeScript, React, Go, PostgreSQL"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="availableFor">Available for</FieldLabel>
                            <FieldDescription>Describe how people can reach out or collaborate with you, and what you're currently available for.</FieldDescription>
                            <Textarea
                                id="availableFor"
                                name="availableFor"
                                defaultValue={user.availableFor ?? ""}
                                placeholder="Freelance, open source, mentoring, discussions"
                            />
                            {isError && data?.fieldErrors?.availableFor && (
                                <FieldDescription>{data.fieldErrors.availableFor}</FieldDescription>
                            )}
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ?
                            <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Profile Details</span>
                            : "Save Profile Details"}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
