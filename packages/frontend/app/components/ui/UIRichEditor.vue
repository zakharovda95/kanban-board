<template>
  <ClientOnly>
    <div class="bg-light-100 rounded-12 border-light-200 size-full border p-12">
      <UIValidationErrors :full="full" :errors="errors">
        <div class="flex size-full flex-col items-end gap-12">
          <div v-if="editor" class="flex w-full items-center gap-24">
            <div class="flex items-center justify-center gap-4">
              <UIIconButton
                icon="mingcute:back-2-line"
                icon-class="scale-110"
                :color="EColor.LIGHT_800"
                :background-color="EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().undo().run()"
              />
              <UIIconButton
                icon="mingcute:forward-2-line"
                icon-class="scale-110"
                :color="EColor.LIGHT_800"
                :background-color="EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().redo().run()"
              />
            </div>

            <div class="flex items-center justify-center gap-4">
              <UIIconButton
                icon="mingcute:bold-line"
                icon-class="scale-110"
                :color="editor.isActive('bold') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('bold') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleBold().run()"
              />
              <UIIconButton
                icon="mingcute:italic-line"
                icon-class="scale-110"
                :color="editor.isActive('italic') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('italic') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleItalic().run()"
              />
              <UIIconButton
                icon="mingcute:underline-line"
                icon-class="scale-110"
                :color="editor.isActive('underline') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('underline') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleUnderline().run()"
              />
              <UIIconButton
                icon="mingcute:strikethrough-line"
                icon-class="scale-110"
                :color="editor.isActive('strike') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('strike') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleStrike().run()"
              />
            </div>

            <div class="flex items-center justify-center gap-4">
              <UIIconButton
                icon="mingcute:list-ordered-line"
                icon-class="scale-110"
                :color="editor.isActive('orderedList') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('orderedList') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleOrderedList().run()"
              />
              <UIIconButton
                icon="mingcute:list-check-line"
                icon-class="scale-110"
                :color="editor.isActive('bulletList') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('bulletList') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleBulletList().run()"
              />
              <UIIconButton
                icon="mingcute:list-check-2-line"
                icon-class="scale-110"
                :color="editor.isActive('taskList') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('taskList') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleTaskList().run()"
              />
            </div>

            <div class="flex items-center justify-center gap-4">
              <UIIconButton
                icon="mingcute:blockquote-line"
                icon-class="scale-110"
                :color="editor.isActive('blockquote') ? EColor.LIGHT_BASE : EColor.LIGHT_800"
                :background-color="editor.isActive('blockquote') ? EColor.GREEN : EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().toggleBlockquote().run()"
              />
              <UIIconButton
                icon="mingcute:dividing-line-line"
                icon-class="scale-110"
                :color="EColor.LIGHT_800"
                :background-color="EColor.LIGHT_200"
                size="small"
                @click:button="editor.chain().focus().setHorizontalRule().run()"
              />
            </div>
          </div>
          <EditorContent
            :editor="editor"
            :name="name"
            class="rounded-8 bg-light-100 focus-within:border-green border-light-200 w-full border p-12 duration-300"
            :class="[editorWrapperClass]"
          />
          <UIMaxLengthCounter v-if="maxLength" :value-length="model.length" :max-length="maxLength" />
        </div>
      </UIValidationErrors>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { EColor } from '@kanban-board/common';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Placeholder } from '@tiptap/extensions';
import { StarterKit } from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';

import UIIconButton from '~/components/ui/buttons/UIIconButton.vue';
import UIValidationErrors from '~/components/ui/UIValidationErrors.vue';

const model = defineModel<string>({ required: true });

const props = withDefaults(
  defineProps<{
    name: string;
    full?: boolean;
    disabled?: boolean;
    placeholder?: string | undefined;
    maxLength?: number | null;
    errors?: string[] | null;
    editorWrapperClass?: string | null;
    editorClass?: string | null;
  }>(),
  {
    full: false,
    disabled: false,
    placeholder: undefined,
    maxLength: null,
    errors: null,
    editorWrapperClass: null,
    editorClass: null,
  },
);

const editor = useEditor({
  content: model.value,
  autofocus: true,
  editable: true,
  injectCSS: true,
  editorProps: {
    attributes: {
      id: props.name,
      class: `size-full min-h-240 outline-none overflow-y-auto ${props.editorClass} text-14 leading-18 resize-y hide-scrollbar`,
    },
  },
  extensions: [
    StarterKit.configure({
      undoRedo: {},
      bold: {
        HTMLAttributes: {
          class: 'font-bold!',
        },
      },
      italic: {
        HTMLAttributes: {
          class: 'italic',
        },
      },
      underline: {
        HTMLAttributes: {
          class: 'underline underline-offset-4',
        },
      },
      strike: {
        HTMLAttributes: {
          class: 'strike',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'editor-ol',
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: 'editor-ul',
        },
      },
      listItem: {
        HTMLAttributes: {
          class: '',
        },
      },
      listKeymap: {},
      paragraph: {
        HTMLAttributes: {
          class: 'text-14 leading-18 block min-h-18',
        },
      },
      link: {
        autolink: true,
        markdownLinks: true,
        defaultProtocol: 'https',
        openOnClick: false,
        linkOnPaste: true,
        shouldAutoLink: url => url.startsWith('https://'),
        HTMLAttributes: {
          class: 'text-14 leading-18 block min-h-18 text-green underline underline-offset-4',
        },
      },
      blockquote: {
        HTMLAttributes: {
          class: 'editor-blockquote border-l-3 border-l-light-400 pl-8 italic! bg-light-100 p-8',
        },
      },
      horizontalRule: {
        HTMLAttributes: {
          class: 'border-t border-t-light-300 my-36',
        },
      },
    }),
    Placeholder.configure({ placeholder: props.placeholder }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'editor-todo',
      },
    }),
    TaskItem.configure({
      nested: false,
      HTMLAttributes: {
        class: '',
      },
    }),
  ],
  onCreate: () => {
    console.log('editor created');
  },
  onUpdate: () => {
    if (props.disabled) return;
    model.value = editor.value?.getHTML() ?? model.value;
  },
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
