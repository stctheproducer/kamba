// SPDX-License-Identifier: Apache-2.0
// Copyright 2025 Chanda Mulenga
export default function ServerError(props: { error: any }) {
  return (
    <>
      <div className="container">
        <div className="title">Server Error</div>

        <span>{props.error.message}</span>
      </div>
    </>
  )
}
