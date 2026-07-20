import css from "./NoteForm.module.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import type { CreateNote } from "@/types/note";
import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

const initialValues: CreateNote = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteFormProps {
  onClose: () => void;
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),

  content: Yup.string().max(500, "Content is too long"),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      onClose();
    },
  });

  return (
    <Formik<CreateNote>
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={(values, actions) => {
        mutation.mutate(values, {
          onSuccess: () => {
            actions.resetForm();
          },
        });
      }}
    >
      <Form>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
