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
import { InboxIcon, MenuIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react"
import { LogoutButton } from "@/components/logout-button"
import { InboxMessages } from "./inbox-messages"

type AddOption = "art" | "collection" | "exhibition" | "course"
type EditOption = "art" | "collection" | "exhibition" | "course"
type Section = "add" | "edit" | "inbox"

export function AdminMenu() {
  const [section, setSection] = useState<Section>("add")
  const [addOption, setAddOption] = useState<AddOption>("art")
  const [editOption, setEditOption] = useState<EditOption>("art")
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleAddSelect = (option: AddOption) => {
    setSection("add")
    setAddOption(option)
    setMobileOpen(false)
  }

  const handleEditSelect = (option: EditOption) => {
    setSection("edit")
    setEditOption(option)
    setMobileOpen(false)
  }

  const handleInboxSelect = () => {
    setSection("inbox")
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <nav className="fixed top-4 right-4 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-md bg-amber-100 p-2 text-sm font-medium transition-colors hover:bg-amber-200"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-menu"
        >
          <MenuIcon className="size-4 text-foreground" />
        </button>

        {mobileOpen && (
          <div
            id="admin-mobile-menu"
            className="fixed inset-0 z-50 flex min-h-dvh flex-col gap-3 overflow-x-hidden overflow-y-auto bg-background/80 p-4 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto rounded-md p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="Close admin menu"
            >
              <XIcon className="size-6" />
            </button>

            <button
              type="button"
              onClick={handleInboxSelect}
              className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Inbox
            </button>

            <div className="space-y-2">
              <p className="px-3 text-sm font-semibold text-muted-foreground">Add</p>
              <button
                type="button"
                onClick={() => handleAddSelect("art")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Tavla
              </button>
              <button
                type="button"
                onClick={() => handleAddSelect("collection")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Kollektion
              </button>
              <button
                type="button"
                onClick={() => handleAddSelect("exhibition")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Utställning
              </button>
              <button
                type="button"
                onClick={() => handleAddSelect("course")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Kurs
              </button>
            </div>

            <div className="space-y-2">
              <p className="px-3 text-sm font-semibold text-muted-foreground">Edit</p>
              <button
                type="button"
                onClick={() => handleEditSelect("art")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Tavla
              </button>
              <button
                type="button"
                onClick={() => handleEditSelect("collection")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Kollektion
              </button>
              <button
                type="button"
                onClick={() => handleEditSelect("exhibition")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Utställning
              </button>
              <button
                type="button"
                onClick={() => handleEditSelect("course")}
                className="w-full rounded-md px-3 py-2 text-left text-base font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Kurs
              </button>
            </div>

            <div className="px-3 pt-2">
              <LogoutButton />
            </div>
          </div>
        )}
      </nav>

      <aside className="fixed top-0 left-0 z-20 hidden h-screen w-56 bg-amber-100 p-10 pt-20 md:block">
        <Menubar className="flex h-full w-full flex-col items-start gap-2 rounded-lg border-none bg-transparent p-0">
          <MenubarMenu>
            <MenubarTrigger onClick={handleInboxSelect}>
              <InboxIcon className="mr-2 size-4" />
              Inbox
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>
              <PlusIcon className="mr-2 size-4" />
              Add
            </MenubarTrigger>
            <MenubarContent side="right" align="start">
              <MenubarItem
                onClick={() => handleAddSelect("art")}
              >
                Tavla
              </MenubarItem>
              <MenubarItem
                onClick={() => handleAddSelect("collection")}
              >
                Kollektion
              </MenubarItem>
              <MenubarItem
                onClick={() => handleAddSelect("exhibition")}
              >
                Utställning
              </MenubarItem>
              <MenubarItem
                onClick={() => handleAddSelect("course")}
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
                onClick={() => handleEditSelect("art")}
              >
                Tavla
              </MenubarItem>
              <MenubarItem
                onClick={() => handleEditSelect("collection")}
              >
                Kollektion
              </MenubarItem>
              <MenubarItem
                onClick={() => handleEditSelect("exhibition")}
              >
                Utställning
              </MenubarItem>
              <MenubarItem
                onClick={() => handleEditSelect("course")}
              >
                Kurs
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <LogoutButton />
          </MenubarMenu>
        </Menubar>
      </aside>

      <div className="sticky top-0 w-full bg-white pt-16 md:ml-56 md:pt-0">
        <div className="max-w-3xl space-y-4">
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
    </div>
  )
}
