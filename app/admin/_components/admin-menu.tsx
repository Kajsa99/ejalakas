"use client"

import { useState } from "react"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { ArtForm, EditArtForm } from "./art-form"
import { CollectionForm, EditCollectionForm } from "./collection-form"
import { ExhibitionForm, EditExhibitionForm } from "./exhibition-form"
import { CourseForm, EditCourseForm } from "./course-form"
import { InboxIcon, PencilIcon, PlusIcon } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { InboxMessages } from "./inbox-messages"

type AddOption = "art" | "collection" | "exhibition" | "course"
type EditOption = "art" | "collection" | "exhibition" | "course"
type Section = "add" | "edit" | "inbox"

export function AdminMenu() {
  const [section, setSection] = useState<Section>("add")
  const [addOption, setAddOption] = useState<AddOption>("art")
  const [editOption, setEditOption] = useState<EditOption>("art")

  return (
    <div className="flex items-start gap-6">
      <Menubar className="flex h-full w-fit flex-col items-start gap-2 border-none p-2">
        <MenubarMenu>
          <MenubarTrigger>
            <PlusIcon className="mr-2 size-4" />
            Add
          </MenubarTrigger>
          <MenubarContent side="right" align="start">
            <MenubarItem
              onClick={() => {
                setSection("add")
                setAddOption("art")
              }}
            >
              Tavla
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setSection("add")
                setAddOption("collection")
              }}
            >
              Kollektion
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setSection("add")
                setAddOption("exhibition")
              }}
            >
              Utställning
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setSection("add")
                setAddOption("course")
              }}
            >
              Kurs
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            <PencilIcon className="mr-2 size-4" />
            Edit
          </MenubarTrigger>
          <MenubarContent side="right" align="start">
            <MenubarItem
              onClick={() => {
                setSection("edit")
                setEditOption("art")
              }}
            >
              Tavla
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setSection("edit")
                setEditOption("collection")
              }}
            >
              Kollektion
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setSection("edit")
                setEditOption("exhibition")
              }}
            >
              Utställning
            </MenubarItem>
            <MenubarItem
              onClick={() => {
                setSection("edit")
                setEditOption("course")
              }}
            >
              Kurs
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger onClick={() => setSection("inbox")}>
            <InboxIcon className="mr-2 size-4" />
            Inbox
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <LogoutButton />
        </MenubarMenu>
      </Menubar>

      <div className="min-w-0 flex-1">
        {section === "add" && (
          <>
            {addOption === "art" && <ArtForm />}
            {addOption === "collection" && <CollectionForm />}
            {addOption === "exhibition" && <ExhibitionForm />}
            {addOption === "course" && <CourseForm />}
          </>
        )}

        {section === "edit" && (
          <>
            {editOption === "art" && <EditArtForm />}
            {editOption === "collection" && <EditCollectionForm />}
            {editOption === "exhibition" && <EditExhibitionForm />}
            {editOption === "course" && <EditCourseForm />}
          </>
        )}

        {section === "inbox" && <InboxMessages />}
      </div>
    </div>
  )
}
