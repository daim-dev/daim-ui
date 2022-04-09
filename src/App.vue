<template>
  <div>
    <div>
      <Spinner></Spinner>
    </div>
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="link">link</Button>
      <Button size="sm">small</Button>
      <Button size="lg">large</Button>
    </div>
    <div>
      <mailgo
        href="mailto:contact@example.com"
        variant="link"
        class="text-black"
      ></mailgo>
      <mailgo
        href="tel:+123-456-278"
        variant="link"
        class="text-black"
      ></mailgo>
    </div>
  </div>
</template>
