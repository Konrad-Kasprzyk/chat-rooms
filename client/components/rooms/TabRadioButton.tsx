import { Dispatch } from "react";

export default function TabRadioButton<Tab extends string>(props: {
  tab: Tab;
  label: string;
  setOpenTab: Dispatch<Tab>;
  defaultChecked?: boolean;
}) {
  return (
    <>
      <input
        type="radio"
        className="btn-check"
        name="btnradio"
        id={props.tab}
        autoComplete="off"
        onChange={() => props.setOpenTab(props.tab)}
        defaultChecked={props.defaultChecked}
      />
      <label className="btn btn-outline-success" htmlFor={props.tab}>
        {props.label}
      </label>
    </>
  );
}
