"use client";
import cls from "classnames";
import { FC, ReactNode, useEffect } from "react";
import { PlusIcon } from "../Icons/plus";
import classes from "./index.module.scss";
import { useData } from "./index.hook";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

export const AccordionItem: FC<AccordionItemProps> = ({ title, children }) => {
  const { isOpen, handleToggle } = useData();
  const slug = () => title.toLowerCase().replace(/ /g, "-");

  useEffect(() => {
    const accordionItems = document.querySelectorAll(
      `.${classes.accordion__item}`
    );

    accordionItems.forEach((item) => {
      item.addEventListener("click", () => {
        new Promise((resolve) => {
          setTimeout(() => {
            const content = item.querySelector<HTMLElement>(
              `.${classes.accordion__item__children}`
            );
            if (!content) return;
            if (
              content.classList.contains(
                classes.accordion__item__children__open
              )
            ) {
              // If the accordion is open, close it
              content.style.height = `${content.scrollHeight}px`;
            } else {
              // If the accordion is closed, open it
              content.style.height = "1px";
            }
            item.classList.toggle("__open");
            resolve(null);
          }, 0);
        });
      });
    });
  }, []);

  return (
    <div
      className={classes.accordion__item}
      role="button"
      aria-expanded={isOpen}
    >
      <div
        className={cls(classes.accordion__item__header, {
          [classes.accordion__item__header__open]: isOpen,
        })}
        onClick={handleToggle}
        aria-controls={`accordion-item-${title}`}
        aria-label={`Toggle ${title} accordion item`}
        role="heading"
        aria-level={3}
      >
        <span
          className={cls(classes.accordion__item__header__title, {
            [classes.accordion__item__header__title__open]: isOpen,
          })}
          role="contentinfo"
        >
          {title}
        </span>
        <div
          className={cls(classes.accordion__item__header__icon, {
            [classes.accordion__item__header__icon__open]: isOpen,
          })}
          id={`accordion-item-${slug}`}
        >
          <PlusIcon />
        </div>
      </div>
      <div
        className={cls(classes.accordion__item__children, {
          [classes.accordion__item__children__open]: isOpen,
        })}
        role="list"
      >
        {children}
      </div>
    </div>
  );
};

interface AccordionProps {
  items?: AccordionItemProps[];
}

export const Accordion: FC<AccordionProps> = ({ items }) => {
  return (
    <div className={classes.accordion} role="tablist">
      {items?.map((item, index) => (
        <AccordionItem key={index} title={item.title}>
          {item.children}
        </AccordionItem>
      ))}
    </div>
  );
};
