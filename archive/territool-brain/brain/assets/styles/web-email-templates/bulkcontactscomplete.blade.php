@extends('mails.layout')
@section('body')
@php
	$cellStyle = 'padding: 0; line-height: 1.6em; text-align: left; font-size: 16px; color: #545454; font-family: Helvetica, Arial, sans-serif;';
	$headingStyle = $cellStyle . ' padding-top: 20px; font-weight: bold;';
	$rowSpacer = 'padding: 0; line-height: 0; height: 12px; font-size: 0;';
@endphp

<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-bottom: 8px;">Dear {{ $userName }},</td>
</tr>
<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-bottom: 16px;">Your bulk contact purchase has completed. Here is the summary:</td>
</tr>
<tr>
	<td colspan="2" style="{{ $headingStyle }} padding-top: 0;">Summary</td>
</tr>
<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-left: 0;">Total contacts requested: {{ $total }}</td>
</tr>
<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-left: 0;">Successfully saved: {{ $successCount }}</td>
</tr>
<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-left: 0;">Failed: {{ $failedCount }}</td>
</tr>
<tr>
	<td colspan="2" style="{{ $rowSpacer }}">&nbsp;</td>
</tr>

@if(count($successList) > 0)
<tr>
	<td colspan="2" style="{{ $headingStyle }}">Contacts successfully added</td>
</tr>
@foreach($successList as $contact)
<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-left: 0;">• {{ !empty($contact['name']) ? $contact['name'] : '—' }}{{ !empty($contact['email']) ? ' - ' . $contact['email'] : '' }}{{ !empty($contact['phone']) ? ' – ' . $contact['phone'] : '' }}</td>
</tr>
@endforeach
<tr>
	<td colspan="2" style="{{ $rowSpacer }}">&nbsp;</td>
</tr>
@endif

@if(count($failedList) > 0)
<tr>
	<td colspan="2" style="{{ $headingStyle }}">Contacts that could not be added</td>
</tr>
@foreach($failedList as $item)
<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-left: 0;">• {{ !empty($item['name']) ? $item['name'] : 'Contact' }}</td>
</tr>
@endforeach
<tr>
	<td colspan="2" style="{{ $rowSpacer }}">&nbsp;</td>
</tr>
@endif

<tr>
	<td colspan="2" style="{{ $cellStyle }} padding-top: 8px;">You can view and manage your contacts in your Territool account.</td>
</tr>
</table>     
@endsection
