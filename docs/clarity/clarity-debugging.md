# Debugging Clarity Contracts

## Using Clarinet Console

```bash
clarinet console

;; Test function calls
(contract-call? .my-contract my-function u100)

;; Check variable values
::get_data_var .my-contract my-variable

;; Check map values
::get_map_entry .my-contract my-map principal-key
```

## Common Errors

### Analysis Error

```
error: use of unresolved variable 'unknown-var'
```

**Fix**: Declare the variable or fix the typo

### Type Error

```
error: expecting expression of type 'uint', found 'int'
```

**Fix**: Use correct type or convert using `to-uint`/`to-int`

## Debugging Tips

1. Use `print` statements in tests
2. Check contract state in console
3. Use `try!` to surface errors early
4. Test edge cases
